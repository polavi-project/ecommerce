<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Services\Cart;


use GuzzleHttp\Promise\FulfilledPromise;
use GuzzleHttp\Promise\Promise;
use GuzzleHttp\Promise\RejectedPromise;
use MJS\TopSort\Implementations\ArraySort;
use function Polavi\_mysql;
use function Polavi\array_find;
use function Polavi\dispatch_event;
use function Polavi\get_base_url_scheme_less;
use Polavi\Module\Checkout\Services\PriceHelper;
use Polavi\Services\Routing\Router;
use function Polavi\str_replace_last;
use function Polavi\the_container;
use Symfony\Component\Filesystem\Filesystem;

class Item
{
    protected $id;

    /**@var Cart $cart*/
    protected $cart;

    protected $fields  = [];

    protected $isRunning = false;

    protected $error;

    protected $dataSource = [];

    /**@var Promise $setDataPromise*/
    protected $setDataPromise;

    public function __construct(Cart $cart, array $dataSource)
    {
        $this->cart = $cart;
        $this->id = uniqid();
        $fields = [
            'cart_item_id' => [
                'resolver' => function (Item $item) {
                    return $item->getData('cart_item_id') ?? $item->getDataSource()['cart_item_id'] ?? null;
                }
            ],
            'product_id' => [
                'resolver' => function (Item $item) {
                    $conn = _mysql();
                    $product = $conn->getTable('product')
                        ->where("product.status", '=', 1)
                        ->leftJoin('product_description')
                        ->load($item->getDataSource()['product_id']);
                    if (!$product) {
                        $item->setError("product_id", "Requested product is not available");
                        return null;
                    }
                    $this->dataSource = array_merge($item->getDataSource(), ["product"=>$product]);
                    return $item->getDataSource()['product_id'];
                }
            ],
            'product_name' => [
                'resolver' => function (Item $item) {
                    return $item->getData('name') ?? $item->dataSource['product']['name'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'product_thumbnail' => [
                'resolver' => function (Item $item) {
                    $fileSystem = new Filesystem();
                    if (!isset($item->getDataSource()['product']['image']) or $item->getDataSource()['product']['image'] == null)
                        return null;
                    if ($fileSystem->exists(MEDIA_PATH . DS . str_replace_last('.', '_thumb.', $item->getDataSource()['product']['image'])))
                        return get_base_url_scheme_less(false) . "/public/media/" . str_replace_last('.', '_thumb.', $item->getDataSource()['product']['image']);
                    else
                        return null;
                },
                'dependencies' => ['product_id']
            ],
            'product_url_key' => [
                'resolver' => function (Item $item) {
                    return $item->getData('product_url_key') ?? $item->dataSource['product']['seo_key'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'product_url' => [
                'resolver' => function (Item $item) {
                    if (!preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $item->getData('product_url_key')))
                        return the_container()->get(Router::class)->generateUrl('product.view', ["id"=>$item->getData('product_id')]);
                    else
                        return the_container()->get(Router::class)->generateUrl('product.view.pretty', ["slug"=>$item->getData('product_url_key')]);
                },
                'dependencies' => ['product_id', 'product_url_key']
            ],
            'product_sku' => [
                'resolver' => function (Item $item) {
                    return $item->getData('product_sku') ?? $item->getDataSource()['product']['sku'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'product_weight' => [
                'resolver' => function (Item $item) {
                    return $item->getData('weight') ?? (float)$item->getDataSource()['product']['weight'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'product_price' => [
                'resolver' => function (Item $item) {
                    return $item->getData('price') ?? $item->getDataSource()['product']['price'] ?? 0;
                },
                'dependencies' => ['product_id']
            ],
            'qty' => [
                'resolver' => function (Item $item) {
                    $items = $this->cart->getItems();
                    $addedQty = 0;
                    foreach ($items as $key=>$i)
                        if ($i->getData('product_sku') == $this->dataSource['product']['sku'] && $i->getId() !== $item->getId())
                            $addedQty = $i->getData('qty');

                    if (!isset($item->getDataSource()['qty']) || $item->getDataSource()['qty'] <= 0) {
                        $item->setError("qty", "Not enough stock");
                        return null;
                    }

                    if (($this->dataSource['product']['qty'] - $addedQty < $item->getDataSource()['qty'] || $item->getDataSource()['product']['stock_availability'] == 0) && $this->dataSource['product']['manage_stock'] == 1)  {
                        $item->setError("qty", "Not enough stock");
                        return null;
                    }
                    return $item->getDataSource()['qty'] ?? $item->getData('qty');
                },
                'dependencies' => ['product_id']
            ],
            'final_price' => [
                'resolver' => function (Item $item) {
                    $priceHelper = the_container()->get(PriceHelper::class);
                    $selectedOptions = $item->getData('product_custom_options');
                    $extraPrice = 0;
                    foreach ($selectedOptions as $id => $option) {
                        foreach ($option['values'] as $value)
                            $extraPrice += floatval($value['extra_price']);
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
                    'product_custom_options'
                ]
            ],
            'product_custom_options' => [
                'resolver' => function (Item $item) {
                    $selectedOptions = $item->dataSource['product_custom_options'] ?? [];
                    if (is_string($selectedOptions)) { // this item is loaded from cart_item table
                        $selectedOptions = json_decode($selectedOptions, true); // Custom option is json string in database
                        $selectedOptions = array_map(function ($o) {
                            return array_keys($o['values'] ?? []);
                        }, $selectedOptions);
                    }

                    $availableOptions = _mysql()->getTable('product_custom_option')
                        ->where('product_custom_option_product_id', '=', $this->getData('product_id'))
                        ->fetchAllAssocPrimaryKey();

                    array_walk($availableOptions, function (&$value, $key) {
                        $value['values'] = _mysql()->getTable('product_custom_option_value')
                            ->where('option_id', '=', (int)$key)
                            ->fetchAllAssocPrimaryKey();
                    });

                    $validatedOptions = [];
                    foreach ($selectedOptions as $id => $value) {
                        if (!in_array($id, array_keys($availableOptions)))
                            unset($selectedOptions[$id]);

                        $validatedOptions[$id] = [
                            'option_id' => $id,
                            'option_name' => $availableOptions[$id]['option_name']
                        ];

                        $values = [];
                        $value = (array) $value;
                        foreach ($value as $val) {
                            if (in_array((int) $val, array_keys($availableOptions[$id]['values'])))
                                $values[(int) $val] = [
                                    'value_id' => (int) $val,
                                    'value_text' => $availableOptions[$id]['values'][(int) $val]['value'],
                                    'extra_price' => $availableOptions[$id]['values'][(int) $val]['extra_price']
                                ];
                        }
                        $validatedOptions[$id]['values'] = $values;
                    }
                    $flag = true;
                    foreach ($availableOptions as $id => $option)
                        if ((int)$option['is_required'] == 1 and (!in_array($id, array_keys($validatedOptions)) || empty($validatedOptions[$id]['values'])))
                            $flag = false;
                    if ($flag == false)
                        $item->setError("product_custom_options", "You need to select some required option to purchase this product");

                    return $validatedOptions;
                }
            ],
            'variant_group_id' => [
                'resolver' => function (Item $item) {
                    return $item->getDataSource()['product']['variant_group_id'] ?? null;
                },
                'dependencies' => ['product_id']
            ],
            'variant_options' => [
                'resolver' => function (Item $item) {
                    if (!$item->getData("variant_group_id"))
                        return null;
                    $selectedOptions = $item->dataSource['variant_options'] ?? [];
                    if (is_string($selectedOptions)) { // this item is loaded from cart_item table
                        $selectedOptions = json_decode($selectedOptions, true);
                    }
                    $conn = _mysql();
                    $group = $conn->getTable("variant_group")->load($item->getData("variant_group_id"));
                    $attrIds = array_filter([
                        $group["attribute_one"],
                        $group["attribute_two"],
                        $group["attribute_three"],
                        $group["attribute_four"],
                        $group["attribute_five"],
                    ], function ($a) {
                        return $a != null;
                    });
                    foreach ($attrIds as $id) {
                        if (!array_find($selectedOptions, function ($a) use ($id) {
                            if (isset($a["attribute_id"]) && $a["attribute_id"] == $id)
                                return $id;
                            return false;
                        })) {
                            $item->setError("variant_options", "You need to select some required option to purchase this product");
                            return null;
                        }
                    }
                    $tmp = $conn->getTable("product")
                        ->addFieldToSelect("product.product_id")
                        ->where("variant_group_id", "=", $item->getData("variant_group_id"))
                        ->andWhere("status", "=", 1);
                    foreach ($selectedOptions as $key=>$val) {
                        $tmp->leftJoin('product_attribute_value_index', "product_attribute_value_index".$key);
                        $tmp->andWhere("product_attribute_value_index{$key}.attribute_id", "=", $val["attribute_id"])
                            ->andWhere("product_attribute_value_index{$key}.option_id", "=", $val["option_id"]);
                    }

                    $p = $tmp->fetchOneAssoc();
                    if (!$p || $p["product_id"] != $item->getData("product_id")) {
                        $item->setError("product_custom_options", "You need to select some required option to purchase this product");
                        return null;
                    }
                    return $conn->getTable("product_attribute_value_index")
                        ->addFieldToSelect("product_attribute_value_index.attribute_id")
                        ->addFieldToSelect("product_attribute_value_index.option_id")
                        ->addFieldToSelect("product_attribute_value_index.attribute_value_text", "option_name")
                        ->addFieldToSelect("attribute.attribute_name")
                        ->addFieldToSelect("attribute.attribute_code")
                        ->leftJoin("attribute")
                        ->where("product_attribute_value_index.product_id", "=", $item->getData("product_id"))
                        ->andWhere("product_attribute_value_index.attribute_id", "IN", $attrIds)
                        ->fetchAllAssoc();
                },
                'dependencies' => ['product_id', 'variant_group_id']
            ],
            'total' => [
                'resolver' => function (Item $item) {
                    return $item->getData('final_price')
                        * $item->getData('qty');
                },
                'dependencies' => [
                    'final_price',
                    'qty'
                ]
            ]
        ];

        dispatch_event("register_cart_item_field", [&$fields]);

        $this->fields = $this->sortFields($fields);
        $this->dataSource = $dataSource;
        $this->onChange(null);
    }

    protected function sortFields(array $fields)
    {
        $sorter = new ArraySort();
        foreach ($fields as $key=>$value) {
            $sorter->add($key, $value['dependencies'] ?? []);
        }
        $sorted = $sorter->doSort();

        $result = [];
        foreach ($sorted as $key=>$value)
            $result[$value] = $fields[$value];

        return $result;
    }

    public function setData($key, $value)
    {
        if ($this->isRunning == true)
            return new RejectedPromise("Can not set value when resolves are running");

        $this->dataSource[$key] = $value;

        if (isset($this->fields[$key]) and !empty($this->fields[$key]['dependencies'])) {
            $promise = new \GuzzleHttp\Promise\Promise(function () use (&$promise, $key, $value) {
                if ($this->getData($key) == $value) {
                    $promise->resolve($value);
                } else
                    $promise->reject("Can not change {$key} field to {$value}");
            });
            $this->setDataPromise = $promise;
            $this->onChange(null);

            return $promise;
        } else {
            $previous = $this->fields[$key]['value'] ?? null;
            $resolver = \Closure::bind($this->fields[$key]["resolver"], $this, get_class($this));
            $_value = $resolver($this);
            if ($value != $_value) {
                $this->fields[$key]['value'] = $_value;
                return new RejectedPromise("Field resolver returns different value");
            } else if ($previous == $_value) {
                return new FulfilledPromise($value);
            } else {
                $this->fields[$key]['value'] = $value;
                $this->onChange($key);
                return new FulfilledPromise($value);
            }
        }
    }

    public function getData($key)
    {
        return $this->fields[$key]['value'] ?? null;
    }

    public function toArray()
    {
        $data = [];
        foreach ($this->fields as $key => $field)
            $data[$key] = $field['value'] ?? null;

        return $data;
    }

    protected function onChange($trigger)
    {
        if ($this->isRunning == false) {
            $this->isRunning = true;
            //$this->error = null;
            foreach ($this->fields as $key=>$value) {
                if ($key != $trigger) {
                    $resolver = \Closure::bind($this->fields[$key]["resolver"], $this, get_class($this));
                    $this->fields[$key]['value'] = $resolver($this);
                }
            }
            $this->isRunning = false;
            if ($this->setDataPromise)
                $this->setDataPromise->wait();
            dispatch_event('cart_item_updated', [$this, $trigger]);
        }
    }

    public function refresh() {
        $this->onChange(null);
    }

    /**
     * @param $field
     * @param $message
     * @return Item
     */
    public function setError($field, $message)
    {
        $this->error[$field] = $message;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @return array
     */
    public function getDataSource(): array
    {
        return $this->dataSource;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }
}