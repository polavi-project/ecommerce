<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services\Cart;


use GuzzleHttp\Promise\FulfilledPromise;
use GuzzleHttp\Promise\Promise;
use GuzzleHttp\Promise\PromiseInterface;
use GuzzleHttp\Promise\RejectedPromise;
use function GuzzleHttp\Promise\settle;
use MJS\TopSort\Implementations\ArraySort;
use function Similik\_mysql;
use function Similik\dispatch_event;
use function Similik\get_config;
use function Similik\get_default_language_Id;
use Similik\Module\Customer\Services\Customer;
use Similik\Module\Discount\Services\CouponHelper;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use function Similik\subscribe;

class Cart
{
    protected $fields = [];

    protected $data = [];

    /** @var Processor $processor*/
    protected $processor;

    /** @var ItemFactory itemFactory*/
    protected $itemFactory;

    /** @var Request $request*/
    protected $request;

    /** @var CouponHelper $couponHelper*/
    protected $couponHelper;

    /** @var Customer $customer*/
    protected $customer;

    /**@var callable[]*/
    protected $resolvers = [];

    protected $isRunning = false;

    protected $dataSource = [];

    /**@var Promise[] $promises*/
    protected $promises = [];

    /**@var Promise[] $setDataPromises*/
    protected $setDataPromises = [];

    protected $error;

    protected $isOrdered = false;

    public function __construct(
        ItemFactory $itemFactory,
        Request $request,
        CouponHelper $couponHelper,
        int $cartId = null
    )
    {
        $this->initFields();
        $itemFactory->setCart($this);
        $this->itemFactory = $itemFactory;
        $this->request = $request;
        $this->processor = new Processor();
        $this->couponHelper = $couponHelper;

        if($cartId) {
            $cartData = $this->processor->getTable('cart')->load($cartId);
            if(!$cartData || $cartData['status'] == 0)
                throw new \Exception("Invalid cart");

            $this->dataSource = $cartData;
            $this->setData('cart_id', $cartId);
        }
        subscribe('cart_item_updated', function() {
            $this->onChange(null);
        });
        subscribe('cart_item_added', function() {
            $this->onChange(null);
        });
        subscribe('cart_item_removed', function() {
            $this->onChange(null);
        });
    }

    protected function initFields()
    {
        $this->fields = [
            'cart_id' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return $dataSource['cart_id'] ?? null;
                }
            ],
            'currency' => [
                'resolver' => function(Cart $cart) {
                    return get_config('general_currency', 'USD');
                }
            ],
            'customer_id' => [
                'resolver' => function(Cart $cart) {
                    return $cart->request->getCustomer()->getData('customer_id');
                }
            ],
            'customer_group_id' => [
                'resolver' => function(Cart $cart) {
                    return $cart->request->getCustomer()->getData('group_id');
                },
                'dependencies' => ['customer_id']
            ],
            'user_ip' => [
                'resolver' => function(Cart $cart) {
                    return $cart->request->getClientIp();
                }
            ],
            'user_agent' => [
                'resolver' => function(Cart $cart) {
                    return $cart->request->headers->get('user-agent');
                }
            ],
            'status' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return  $dataSource['status'] ?? $cart->getData('status') ?? 1;
                }
            ],
            'total_qty' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $count = 0;
                    foreach ($cart->getItems() as $item)
                        $count = $count + (int)$item->getData('qty');

                    return $count;
                },
                'dependencies' => ['items']
            ],
            'total_weight' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $weight = 0;
                    foreach ($cart->getItems() as $item)
                        $weight += $item->getData('product_weight') * $item->getData('qty');

                    return $weight;
                },
                'dependencies' => ['items']
            ],
            'shipping_fee_excl_tax' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return (float)dispatch_event('cart_shipping_fee_calculate', [$this]);
                },
                'dependencies' => ['shipping_method', 'total_weight']
            ],
            'shipping_fee_incl_tax' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return $cart->getData('shipping_fee_excl_tax'); // TODO: Adding tax
                },
                'dependencies' => ['shipping_fee_excl_tax']
            ],
            'coupon' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    try {
                        $coupon = $dataSource['coupon'] ?? $cart->data['coupon'] ?? null;
                        return $this->couponHelper->applyCoupon($coupon, $cart);
                    } catch (\Exception $e) {
                        return $cart->data['coupon'];
                    }
                },
                'dependencies' => ['customer_id', 'customer_group_id', 'items']
            ],
            'discount_amount' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $items = $cart->getItems();
                    $discount = 0;
                    foreach ($items as $item)
                        $discount +=$item->getData('discount_amount');

                    return $discount;
                },
                'dependencies' => ['coupon']
            ],
            'tax_amount' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $itemTax = 0;
                    foreach ($cart->getItems() as $item)
                        $itemTax += $item->getData('tax_amount');
                    return $itemTax + $cart->getData('shipping_fee_incl_tax') - $cart->getData('shipping_fee_excl_tax');
                },
                'dependencies' => ['shipping_fee_incl_tax', 'discount_amount']
            ],
            'sub_total' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $total = 0;
                    foreach ($cart->getItems() as $item)
                        $total += $item->getData('final_price') * $item->getData('qty');

                    return $total ;
                },
                'dependencies' => ['discount_amount', 'items']
            ],
            'grand_total' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return $cart->getData('sub_total') - $cart->getData('discount_amount') + $cart->getData('tax_amount') + $cart->getData('shipping_fee_incl_tax');
                },
                'dependencies' => ['sub_total', 'tax_amount', 'payment_method', 'shipping_fee_incl_tax']
            ],
            'shipping_address_id' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $id = $dataSource['shipping_address_id'] ?? null;
                    $conn = _mysql();
                    if(!$id || !$conn->getTable('cart_address')->load($id))
                        $this->error = "Shipping address can not be empty";

                    return  $id;
                }
            ],
            'shipping_method' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $method = dispatch_event('apply_shipping_method', [$this, $dataSource]);
                    if(!$method)
                        $this->error = "Shipping method can not be empty";

                    return $method;
                },
                'dependencies' => ['sub_total']
            ],
            'shipping_method_name' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return $dataSource['shipping_method_name'] ?? $dataSource['shipping_method_name'] ?? null;
                }
            ],
            'shipping_note' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return $dataSource['shipping_note'] ?? $dataSource['shipping_note'] ?? null;
                }
            ],
            'billing_address_id' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $id = $dataSource['billing_address_id'] ?? null;
                    $conn = _mysql();
                    if(!$id || !$conn->getTable('cart_address')->load($id))
                        return null;
                    return  $id;
                }
            ],
            'payment_method' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    $method = dispatch_event('apply_payment_method', [$this, $dataSource]);
                    if(!$method)
                        $this->error = "Payment method can not be empty";

                    return $method;
                },
                'dependencies' => ['sub_total']
            ],
            'payment_method_name' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    return $dataSource['payment_method_name'] ?? $dataSource['payment_method_name'] ?? null;
                }
            ],
            'items' => [
                'resolver' => function(Cart $cart, $dataSource) {
                    if($cart->itemFactory->getItems())
                        return $cart->itemFactory->getItems();
                    else {
                        $items = [];
                        $rows = $this->processor->getTable('cart_item')
                            ->where('cart_id', '=', $cart->getData('cart_id'))
                            ->fetchAllAssoc();
                        foreach ($rows as $row) {
                            $items[] = $this->itemFactory->createItem(
                                (int) $row['product_id'],
                                (int) $row['qty'],
                                $row['product_custom_options'] ? json_decode($row['product_custom_options'], true) : [],
                                (int) $this->request->getSession()->get('language', get_default_language_Id()),
                                $row['requested_data'] ? json_decode($row['requested_data'], true) : [],
                                (int) $row['cart_item_id']
                            );
                        }
                        if(empty($items))
                            $this->error = "Shopping cart is empty";

                        return $items;
                    }
                },
                'dependencies' => ['cart_id', 'customer_group_id', 'shipping_address_id'],
            ]
        ];

        $sorter = new ArraySort();
        foreach ($this->fields as $key=>$value) {
            $sorter->add($key, $value['dependencies'] ?? []);
        }
        $sorted = $sorter->doSort();

        foreach ($sorted as $key=>$value)
            $this->resolvers[$value] = $this->fields[$value]['resolver'];
    }

    public function addItem(
        int $productId,
        int $qty,
        array $selectedCustomOptions = [],
        int $language = null,
        array $requestedData = []
    ) {
        $item = $this->itemFactory->createItem(
            $productId,
            $qty,
            $selectedCustomOptions,
            $language,
            $requestedData
        );

        $promise = new \GuzzleHttp\Promise\Promise(function() use (&$promise, $item) {
            $promise->resolve($item);
        });
        $this->promises[] = $promise;

        return $promise;
    }

    public function removeItem($id)
    {
        $item = $this->itemFactory->removeItem($id);

        $promise = new \GuzzleHttp\Promise\Promise(function() use (&$promise, $item) {
            $promise->resolve($item);
        });
        $this->promises[] = $promise;

        return $promise;
    }

    public function addField($field, $defaultValue = null, callable $resolver = null, $dependencies = [])
    {
        if(isset($this->fields[$field]))
            throw new \Exception(sprintf("Field %s already exist", $field));
        $this->fields[$field] = [
            'resolve'=> $resolver,
            'dependencies' => $dependencies,
            'value' => $defaultValue
        ];

        return $this;
    }

    public function removeField($field)
    {
        if(isset($this->fields[$field]))
            unset($this->fields[$field]);

        return $this;
    }

    /**
     * @param $key
     * @param $value
     * @return PromiseInterface
     */

    public function setData($key, $value)
    {
        if($this->isOrdered != false)
            return new RejectedPromise("Cart is disabled");

        if($this->isRunning == true)
            return new RejectedPromise("Can not set value when resolves are running");

        if(isset($this->fields[$key]) and !empty($this->fields[$key]['dependencies'])) {
            $this->dataSource[$key] = $value;
            $promise = new \GuzzleHttp\Promise\Promise(function() use (&$promise, $key, $value) {
                if($this->getData($key) == $value) {
                    $promise->resolve($value);
                } else
                    $promise->reject("Can not change {$key} field to {$value}");
            });
            $this->setDataPromises[$key] = $promise;
            $this->onChange(null);

            return $promise;
        } else {
            if(isset($this->data[$key]) and $this->data[$key] === $value)
                return new FulfilledPromise($value);

            $resolver = \Closure::bind($this->resolvers[$key], $this);
            $_value = $resolver($this, array_merge($this->dataSource, [$key=> $value]));

            if($value != $_value) {
                return new RejectedPromise("Field resolver returns different value");
            } else {
                $this->data[$key] = $value;
                $this->dataSource[$key] = $value;
                $this->onChange($key);
                return new FulfilledPromise($value);
            }
        }
    }

    protected function onChange($trigger)
    {
        if($this->isOrdered != false)
            return null;

        if($this->isRunning == false) {
            $this->isRunning = true;
            $this->error = null;
            foreach ($this->resolvers as $field=>$resolver) {
                if($field != $trigger) {
                    $bound = \Closure::bind($resolver, $this);
                    $this->data[$field] = $bound($this, $this->dataSource);
                }
            }
            $this->isRunning = false;
            $promise = settle($this->setDataPromises);
            $promise->wait();
            dispatch_event('cart_updated', [$this, $trigger]);
        }
    }

    public function getData($key)
    {
        return $this->data[$key] ?? null;
    }

    public function toArray()
    {
        return $this->data;
    }

    /**
     * @return Item[]
     */
    public function getItems()
    {
        return $this->data['items'] ?? [];
    }

    public function isEmpty()
    {
        return empty($this->data['items']);
    }

    /**
     * @return Promise[]
     */
    public function getPromises(): array
    {
        return $this->promises;
    }

    public function createOrderSync()
    {
        $shippingAddress = $this->processor->getTable('cart_address')->load($this->getData('shipping_address_id'));
        if(!$shippingAddress)
            throw new \Exception("Please provide shipping address");

        if($this->error)
            throw new \Exception($this->error);

        $items = $this->getItems();
        foreach ($items as $item)
            if($item->getError())
                throw new \Exception("There is an error in shopping cart item");

        // Start saving order
        $customerId = $this->getData('customer_id');
        if($customerId) {
            $customer = $this->processor->getTable('customer')->load($customerId);
            if(!$customer)
                throw new \Exception("Customer does not exist");
            $customerData = [
                'customer_email' => $customer['email'],
                'customer_full_name' => $customer['full_name'],
            ];
        } else {
            $customerData = [
                'customer_email' => null,
                'customer_full_name' => null
            ];
        }
        $autoIncrement = $this
            ->processor
            ->executeQuery("SELECT `AUTO_INCREMENT` FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = :database AND TABLE_NAME   = :table", ['database'=> DB_DATABASE, 'table'=>'order'])
            ->fetch(\PDO::FETCH_ASSOC);

        $orderData = array_merge($this->data, $customerData, [
            'order_number' =>10000 + (int)$autoIncrement['AUTO_INCREMENT'],
            'status' => 'pending',
            'shipment_status' => 'pending',
            'payment_status' => 'pending'
        ]);

        dispatch_event("filter_order_data", [&$orderData]);

        $this->processor->startTransaction();
        try {
            // Order address
            $shippingAddressId = $this->processor->getTable('order_address')
                ->insert($shippingAddress);
            $billingAddress = $this->processor->getTable('cart_address')->load($this->getData('billing_address_id'));
            if(!$billingAddress)
            $billingAddress = $shippingAddress;
            $this->processor->getTable('order_address')
                ->insert($billingAddress);
            $billingAddressId = $this->processor->getLastID();

            $this->processor->getTable('order')
                ->insert(array_merge($orderData, [
                    'shipping_address_id' => $shippingAddressId,
                    'billing_address_id' => $billingAddressId
                ]));
            $orderId = $this->processor->getLastID();
            $items = $this->getItems();
            foreach ($items as $item) {
                $itemData = array_merge($item->toArray(), ['order_item_order_id' => $orderId]);
                dispatch_event("filter_order_data", [&$itemData]);

                $this->processor->getTable('order_item')->insert($itemData);
            }

            // Order activities
            $this->processor->getTable('order_activity')
                ->insert([
                    'order_activity_order_id' => $orderId,
                    'comment' => 'Order created',
                    'customer_notified' => 0
                ]);
            $this->isOrdered = $orderId;

            // Disable cart
            $this->processor->getTable('cart')
                ->where('cart_id', '=', $this->getData('cart_id'))
                ->update(['status'=>0]);
            $this->processor->commit();

            return $orderId;
        } catch (\Exception $e) {
            $this->processor->rollback();
            throw $e;
        }
    }

    public function createOrder()
    {
        if($this->isOrdered != false) {
            return new FulfilledPromise($this->isOrdered);
        }

        $promise = new \GuzzleHttp\Promise\Promise(function() use (&$promise) {
            $orderId = $this->createOrderSync();
            $promise->resolve($orderId);
        });
        
        $this->promises[] = $promise;

        return $promise;
    }

    public function destroy()
    {
        $this->itemFactory = new ItemFactory($this->processor);
        $this->dataSource = [];
        $this->itemFactory->setCart($this);
        $this->setData('cart_id', null);
    }
}