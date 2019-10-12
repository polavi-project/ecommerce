<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services\Cart;


use MJS\TopSort\Implementations\ArraySort;
use function Similik\_mysql;
use function Similik\dispatch_event;
use function Similik\get_default_language_Id;
use Similik\Module\Checkout\Services\PriceHelper;
use Similik\Module\Discount\Services\CouponHelper;
use Similik\Module\Tax\Services\TaxCalculator;
use Similik\Services\Db\Processor;
use function Similik\the_container;
use Symfony\Component\Filesystem\Filesystem;

class ItemFactory
{
    /**@var Cart $cart*/
    protected $cart;

    protected $fields = [];

    protected $callbacks = [];

    /**
     * @var Item[]
     */
    protected $items = [];

    /** @var Processor $processor*/
    protected $processor;

    public function __construct(Processor $processor)
    {
        $this->fields = [
            'cart_item_id' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('cart_item_id') ?? $dataSource['cart_item_id'] ?? null;
                }
            ],
            'product_id' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('product_id') ?? $dataSource['product_id'] ?? null;
                }
            ],
            'product_name' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('name') ?? $dataSource['name'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'product_url_key' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('product_url_key') ?? $dataSource['seo_key'] ?? "";
                },
                'dependencies' => ['product_id']
            ],
            'product_sku' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('product_sku') ?? $dataSource['sku'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'product_weight' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('weight') ?? $dataSource['weight'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'product_price' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('price') ?? $dataSource['price'] ?? 0;
                }
            ],
            'product_price_incl_tax' => [
                'resolver' => function(Item $item, $dataSource) {
                    return TaxCalculator::getTaxAmount(
                        $item->getData('product_price'),
                        $item->getData('tax_percent')
                    ) + $item->getData('product_price');
                },
                'dependencies' => ['product_price', 'tax_percent']
            ],
            'qty' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $dataSource['qty'] ?? $item->getData('qty');
                }
            ],
            'final_price' => [
                'resolver' => function(Item $item, $dataSource) {
                    $priceHelper = the_container()->get(PriceHelper::class);
                    $selectedOptions = $item->getData('product_custom_options');
                    $extraPrice = 0;
                    foreach ($selectedOptions as $optionId => $optionValueId) {
                        $extraPrice += $selectedOptions[$optionId]['extra_price'];
                    }
                    return $priceHelper->getProductSalePrice(
                            $item->getData('product_id'),
                            $item->getData('product_price'),
                            $item->getData('qty'),
                            $this->cart->getData('customer_group_id')
                        ) + $extraPrice;
                },
                'dependencies' => [
                    'product_price',
                    'qty',
                    'tax_percent',
                    'product_custom_options'
                ]
            ],
            'final_price_incl_tax' => [
                'resolver' => function(Item $item, $dataSource) {
                    return TaxCalculator::getTaxAmount(
                            $item->getData('final_price'),
                            $item->getData('tax_percent')
                        ) + $item->getData('final_price');
                },
                'dependencies' => ['final_price', 'tax_percent']
            ],
            'tax_percent' => [
                'resolver' => function(Item $item, $dataSource) {
                    $conn = _mysql();
                    $shippingAddress = $conn->getTable('cart_address')->load($this->cart->getData('shipping_address_id'));
                    if($shippingAddress) {
                        TaxCalculator::setCountry($shippingAddress['country']);
                        TaxCalculator::setProvince($shippingAddress['province']);
                        TaxCalculator::setPostcode($shippingAddress['postcode']);
                    }
                    return TaxCalculator::getTaxPercent($dataSource['tax_class']);
                }
            ],
            'tax_amount' => [
                'resolver' => function(Item $item, $dataSource) {
                    return TaxCalculator::getTaxAmount(
                        $item->getData('product_price') * $item->getData('qty'),
                        $item->getData('tax_percent')
                    );
                },
                'dependencies' => [
                    'product_price',
                    'qty',
                    'tax_percent',
                    'discount_amount'
                ]
            ],
            'discount_amount' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $dataSource['discount_amount'] ?? $item->getData('discount_amount') ?? 0;
                },
                'dependencies' => [
                    'product_price',
                    'qty'
                ]
            ],
            'product_custom_options' => [
                'resolver' => function(Item $item, $dataSource) {
                    $selectedOptions = $dataSource['selected_custom_options'];
                    $availableOptions = $dataSource['custom_options'];

                    foreach ($selectedOptions as $id => $value) {
                        if(is_array($value))
                            $value = $value['value_id'];
                        if (!in_array($id, array_keys($availableOptions)) || !in_array($value, array_keys($availableOptions[$id]['values'])))
                            unset($selectedOptions[$id]);
                        else
                            $selectedOptions[$id] = [
                                'value_id'=> $value,
                                'value_text'=> $availableOptions[$id]['values'][$value]['value'],
                                'extra_price' => $availableOptions[$id]['values'][$value]['extra_price']
                            ];
                    }
                    $flag = true;
                    foreach ($availableOptions as $id => $option)
                        if ((int)$option['is_required'] == 1 and !in_array($id, array_keys($selectedOptions)))
                            $flag = false;
                    if($flag == false)
                        $item->setError("You need to select some required option to purchase this product");

                    return $selectedOptions;
                }
            ],
            'total' => [
                'resolver' => function(Item $item, $dataSource) {
                    return $item->getData('final_price')
                        * $item->getData('qty')
                        + $item->getData('tax_amount')
                        - $item->getData('discount_amount');
                },
                'dependencies' => [
                    'final_price',
                    'qty',
                    'discount_amount'
                ]
            ]
        ];

        $this->processor = $processor;
    }

    public function addField($field, callable $resolver = null, $dependencies = [])
    {
        if(!empty($this->items))
            throw new \Exception("You can not add/remove field after an Item generated");
        if(isset($this->fields[$field]))
            throw new \Exception(sprintf("Field %s already exist", $field));
        $this->fields[$field] = [
            'resolver'=> $resolver,
            'dependencies' => $dependencies
        ];

        return $this;
    }

    public function removeField($field)
    {
        if(!empty($this->items))
            throw new \Exception("You can not add/remove field after an Item generated");
        if(isset($this->fields[$field]))
            unset($this->fields[$field]);

        return $this;
    }

    public function createItem(
        int $productId,
        int $qty,
        array $selectedCustomOptions = [],
        int $language = null,
        array $requestedData = [],
        int $cartItemId = null
    )
    {
        if(empty($this->callbacks))
            $this->buildCallbacks();
        if(!$this->cart)
            return null;

        $items = $this->getItems();
        $addedQty = 0;
        foreach ($items as $id=>$item) {
            if($productId == $item->getData('product_id')) {
                $addedQty += $item->getData('qty');
                if($item->getData('product_custom_options') == $selectedCustomOptions) {
                    $value = $item->setData('qty', (int)$addedQty + (int)$qty);
                    return $item;
                    break;
                }
            }
        }

        $product = $this->processor->getTable('product')
            ->leftJoin('product_description', null, [
                [
                    'column'      => "product_description.language_id",
                    'operator'    => "=",
                    'value'       => $language ?? get_default_language_Id(),
                    'ao'          => 'and',
                    'start_group' => null,
                    'end_group'   => null
                ]
            ])
            ->load($productId);
        if(!$product)
            throw new \RuntimeException("Requested product does not exist");

        // Validate custom option
        $productCustomOptions = $this->processor->getTable('product_custom_option')
            ->where('product_custom_option_product_id', '=', $productId)
            ->fetchAllAssocPrimaryKey();
        array_walk($productCustomOptions, function (&$value, $key) {
            $value['values'] = $this->processor->getTable('product_custom_option_value')
                ->where('option_id', '=', (int)$key)
                ->fetchAllAssocPrimaryKey();
        });
        $itemData = array_merge($product, [
                'requested_data' => json_encode($requestedData, JSON_NUMERIC_CHECK),
                'custom_options' => $productCustomOptions,
                'selected_custom_options' => $selectedCustomOptions,
                'qty' => $qty
            ]);
        dispatch_event('filter_item_data', [&$itemData]);

        $item = new Item($this->fields, $itemData);

        if($product['status'] == 0)
            $item->setError(sprintf("%s is not available for sale", $product['name']));
        if(($product['qty'] < 1 || $product['stock_availability'] == 0) && $product['manage_stock'] == 1)
            $item->setError(sprintf("%s is out of stock", $product['name']));
        if($product['qty'] - $addedQty < $qty)
            $item->setError(sprintf("We don't have enough stock for %s", $product['name']));

        $item->setResolvers($this->callbacks);
        $item->setData('cart_item_id', $cartItemId);

        if(!$item->getError() or $item->getData('cart_item_id')) {
            $this->items[] = $item;
            dispatch_event('cart_item_added', [$item]);
        }

        return $item;
    }

    public function removeItem($id)
    {
        foreach ($this->items as $key => $item) {
            if($item->getData('cart_item_id') == $id) {
                unset($this->items[$key]);
                dispatch_event('cart_item_removed', [$item]);

                return $item;
            }
        }

        return $this;
    }
    /**
     * @return Item[]
     */
    public function getItems(): array
    {
        return $this->items;
    }

    protected function validateCustomOption(array &$selectedOptions, array $availableOptions) {
        foreach ($selectedOptions as $id => $value) {
            if (!in_array($id, array_keys($availableOptions)) || !in_array($value, array_keys($availableOptions[$id]['values'])))
                unset($selectedOptions[$id]);
        }
        $flag = true;
        foreach ($availableOptions as $id => $option)
            if ((int)$option['is_required'] == 1 and !in_array($id, array_keys($selectedOptions)))
                $flag = false;
        if($flag == false)
            throw new \RuntimeException("You need to select some required option to purchase this product");

        return $selectedOptions;
    }

    protected function buildCallbacks()
    {
        $sorter = new ArraySort();
        foreach ($this->fields as $key=>$value) {
            $sorter->add($key, $value['dependencies'] ?? []);
        }
        $sorted = $sorter->doSort();

        foreach ($sorted as $key=>$value)
            $this->callbacks[$value] = $this->fields[$value]['resolver'];
    }

    /**
     * @param Cart $cart
     * @return ItemFactory
     */
    public function setCart(Cart $cart): ItemFactory
    {
        $this->cart = $cart;

        return $this;
    }
}