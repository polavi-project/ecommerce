<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services\Cart;


use GuzzleHttp\Promise\FulfilledPromise;
use GuzzleHttp\Promise\Promise;
use GuzzleHttp\Promise\PromiseInterface;
use GuzzleHttp\Promise\RejectedPromise;
use MJS\TopSort\Implementations\ArraySort;
use function Similik\_mysql;
use function Similik\create_mutable_var;
use function Similik\dispatch_event;
use function Similik\get_config;
use Similik\Services\Http\Request;

class Cart
{
    protected $fields = [];

    /** @var Request $request*/
    protected $request;

    /**@var callable[]*/
    protected $resolvers = [];

    protected $isRunning = false;

    protected $dataSource = [];

    /**@var Promise[] $promises*/
    protected $promises = [];

    /**@var Promise $setDataPromises*/
    protected $setDataPromise;

    protected $error;

    protected $isOrdered = false;

    public function __construct(
        Request $request
    )
    {
        $this->initFields();
        $this->request = $request;
    }

    public function initFromId(int $id) {
        if(!$this->getData("cart_id")) {
            $data = _mysql()->getTable('cart')->load($id);
            $this->dataSource = $data;
            $this->setData('cart_id', $id);
        }

        return $this;
    }

    protected function initFields()
    {
        $fields = [
            'cart_id' => [
                'resolver' => function(Cart $cart) {
                    return $this->dataSource['cart_id'] ?? null;
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
                    if($cart->request->getCustomer()->isLoggedIn())
                        return $cart->request->getCustomer()->getData('group_id') ?? 1;
                    else
                        return 999;
                },
                'dependencies' => ['customer_id']
            ],
            'customer_email' => [
                'resolver' => function(Cart $cart) {
                    if($cart->request->getCustomer()->isLoggedIn())
                        $email = $cart->request->getCustomer()->getData('email');
                    else
                        $email = $this->dataSource['customer_email'] ?? null;
                    if(!$email)
                        $this->error = "Customer email could not be empty";

                    return $email;
                },
                'dependencies' => ['customer_id']
            ],
            'customer_full_name' => [
                'resolver' => function(Cart $cart) {
                    if($cart->getData("customer_id"))
                        $name = $cart->request->getCustomer()->getData('full_name');
                    else
                        $name = $this->dataSource['customer_full_name'] ?? null;
                    if(!$name)
                        $this->error = "Customer name could not be empty";

                    return $name;
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
                'resolver' => function(Cart $cart) {
                    return  $this->dataSource['status'] ?? $cart->getData('status') ?? 1;
                }
            ],
            'total_qty' => [
                'resolver' => function(Cart $cart) {
                    $count = 0;
                    foreach ($cart->getItems() as $item)
                        $count = $count + (int)$item->getData('qty');

                    return $count;
                },
                'dependencies' => ['items']
            ],
            'total_weight' => [
                'resolver' => function(Cart $cart) {
                    $weight = 0;
                    foreach ($cart->getItems() as $item)
                        $weight += $item->getData('product_weight') * $item->getData('qty');

                    return $weight;
                },
                'dependencies' => ['items']
            ],
            'shipping_fee_excl_tax' => [
                'resolver' => function(Cart $cart) {
                    return (float)create_mutable_var('shipping_fee_excl_tax', null, [$this]);
                },
                'dependencies' => ['shipping_method', 'total_weight']
            ],
            'sub_total' => [
                'resolver' => function(Cart $cart) {
                    $total = 0;
                    foreach ($cart->getItems() as $item)
                        $total += $item->getData('final_price') * $item->getData('qty');

                    return $total ;
                },
                'dependencies' => ['items']
            ],
            'grand_total' => [
                'resolver' => function(Cart $cart) {
                    return $cart->getData('sub_total') + $cart->getData('shipping_fee_excl_tax');
                },
                'dependencies' => ['sub_total', 'payment_method']
            ],
            'shipping_address_id' => [
                'resolver' => function(Cart $cart) {
                    $id = $this->dataSource['shipping_address_id'] ?? null;
                    $conn = _mysql();
                    if(!$id || !$conn->getTable('cart_address')->load($id))
                        $this->error = "Shipping address can not be empty";

                    return  $id;
                }
            ],
            'shipping_method' => [
                'resolver' => function(Cart $cart) {
                    $method = create_mutable_var("shipping_method", null, [$this]);
                    if(!$method)
                        $this->error = "Shipping method can not be empty";

                    return $method;
                },
                'dependencies' => ['sub_total', 'shipping_address_id']
            ],
            'shipping_method_name' => [
                'resolver' => function(Cart $cart) {
                    return $this->dataSource['shipping_method_name'] ?? $this->dataSource['shipping_method_name'] ?? null;
                }
            ],
            'shipping_note' => [
                'resolver' => function(Cart $cart) {
                    return $this->dataSource['shipping_note'] ?? $this->dataSource['shipping_note'] ?? null;
                }
            ],
            'billing_address_id' => [
                'resolver' => function(Cart $cart) {
                    $id = $this->dataSource['billing_address_id'] ?? null;
                    $conn = _mysql();
                    if(!$id || !$conn->getTable('cart_address')->load($id))
                        return null;
                    return  $id;
                }
            ],
            'payment_method' => [
                'resolver' => function(Cart $cart) {
                    $method = create_mutable_var("payment_method", null, [$this]);
                    if(!$method)
                        $this->error = "Payment method can not be empty";

                    return $method;
                },
                'dependencies' => ['sub_total']
            ],
            'payment_method_name' => [
                'resolver' => function(Cart $cart) {
                    return $this->dataSource['payment_method_name'] ?? $this->dataSource['payment_method_name'] ?? null;
                }
            ],
            'items' => [
                'resolver' => function(Cart $cart) {
                    $items = [];
                    if(isset($this->dataSource['items'])) {
                        foreach ($this->dataSource['items'] as $item) {
                            if($item->getData('cart_item_id') != null || !$item->getError())
                                $item->refresh();
                            $items[$item->getId()] = $item;
                        }
                    } else {
                        $conn = _mysql();
                        $is = $conn->getTable('cart_item')->where('cart_id', '=', $this->getData('cart_id'))->fetchAllAssoc();
                        foreach ($is as $v) {
                            $i = new Item($cart, $v);
                            $flag = true;
                            foreach ($items as $id=>$_i) {
                                if($_i->getData('product_sku') == $i->getData('product_sku') && $_i->getData('product_custom_options') == $i->getData('product_custom_options')) {
                                    $_i->setData('qty', $_i->getData('qty') + $i->getData('qty'));
                                    $flag = false;
                                    break;
                                }
                            }
                            if($flag == false) {
                                $conn->getTable("cart_item")->where("cart_item_id", "=", $v['cart_item_id'])->delete();
                            } else
                                $items[$i->getId()] = $i;
                        }
                        $this->dataSource["items"] = $items;
                    }

                    return $items;
                },
                'dependencies' => ['cart_id', 'customer_group_id', 'shipping_address_id'],
            ]
        ];
        dispatch_event("register_cart_field", [&$fields]);

        $this->fields = $this->sortFields($fields);

        return $this;
    }

    public function addItem(array $itemData) {
        $item = new Item($this, $itemData);
        if($item->getError())
            return new RejectedPromise($item);

        $items = $this->getData('items') ?? [];
        $flag = false;
        foreach ($items as $id=>$i) {
            if($i->getData('product_sku') == $item->getData('product_sku') && $i->getData('product_custom_options') == $item->getData('product_custom_options')) {
                $item->setData('qty', $i->getData('qty') + $item->getData('qty'));
                unset($items[$id]);
                $items[$item->getId()] = $item;
                $flag = true;
                break;
            }
        }

        if($flag == false)
            $items[$item->getId()] = $item;

        $promise = $this->setData('items', $items);

        if($promise->getState() == 'fulfilled' && $this->getItem($item->getId()))
            return new FulfilledPromise($item);
        else
            return new RejectedPromise($item);
    }

    public function getField($field) {
        return $this->fields[$field] ?? null;
    }

    public function addField($field, callable $resolver = null, $dependencies = [])
    {
        $this->fields[$field] = [
            'resolve' => $resolver,
            'dependencies' => $dependencies
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

        $this->dataSource[$key] = $value;

        if(isset($this->fields[$key]) and !empty($this->fields[$key]['dependencies'])) {
            $this->dataSource[$key] = $value;
            $promise = new \GuzzleHttp\Promise\Promise(function() use (&$promise, $key, $value) {
                if($this->getData($key) == $value) {
                    $promise->resolve($value);
                } else
                    $promise->reject("Can not change {$key} field");
            });
            $this->setDataPromise = $promise;
            $this->onChange(null);

            return $promise;
        } else {
            $previous = $this->fields[$key]['value'] ?? null;
            $resolver = \Closure::bind($this->fields[$key]["resolver"], $this);
            $_value = $resolver($this);

            if($value != $_value) {
                $this->fields[$key]['value'] = $_value;
                return new RejectedPromise("Field resolver returns different value");
            } else if($previous == $_value) {
                return new FulfilledPromise($value);
            } else {
                $this->fields[$key]['value'] = $value;
                $this->dataSource[$key] = $value;
                $this->onChange($key);
                return new FulfilledPromise($value);
            }
        }
    }

    protected function onChange($key)
    {
        if($this->isOrdered != false)
            return null;

        if($this->isRunning == false) {
            $this->isRunning = true;
            $this->error = null;
            foreach ($this->fields as $k=>$value) {
                if($k != $key) {
                    $this->fields[$k]['value'] = $value["resolver"]($this, $this->dataSource);
                }
            }
            $this->isRunning = false;
            if($this->setDataPromise)
                $this->setDataPromise->wait(false);
            dispatch_event('cart_updated', [$this, $key]);
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

    /**
     * @return Item[]
     */
    public function getItems()
    {
        return $this->fields['items']['value'] ?? [];
    }

    /**
     * @return Item
     */
    public function getItem($id)
    {
        return $this->getData("items")[$id] ?? null;
    }

    public function isEmpty()
    {
        return empty($this->getItems());
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
        $conn = _mysql();
        $shippingAddress = $conn->getTable('cart_address')->load($this->getData('shipping_address_id'));
        if(!$shippingAddress)
            throw new \Exception("Please provide shipping address");

        if($this->error)
            throw new \Exception($this->error);

        $items = $this->getItems();
        foreach ($items as $item)
            if($item->getError())
                throw new \Exception("There is an error in shopping cart item");

        $autoIncrement = $conn
            ->executeQuery("SELECT `AUTO_INCREMENT` FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = :database AND TABLE_NAME   = :table", ['database'=> DB_DATABASE, 'table'=>'order'])
            ->fetch(\PDO::FETCH_ASSOC);

        $orderData = array_merge($this->toArray(), [
            'order_number' =>10000 + (int)$autoIncrement['AUTO_INCREMENT'],
            'shipment_status' => 'pending',
            'payment_status' => 'pending'
        ]);

        dispatch_event("filter_order_data", [&$orderData]);

        $conn->startTransaction();
        try {
            // Order address
            $shippingAddressId = $conn->getTable('order_address')
                ->insert($shippingAddress);
            $billingAddress = $conn->getTable('cart_address')->load($this->getData('billing_address_id'));
            if(!$billingAddress)
            $billingAddress = $shippingAddress;
            $conn->getTable('order_address')
                ->insert($billingAddress);
            $billingAddressId = $conn->getLastID();

            $conn->getTable('order')
                ->insert(array_merge($orderData, [
                    'shipping_address_id' => $shippingAddressId,
                    'billing_address_id' => $billingAddressId
                ]));
            $orderId = $conn->getLastID();
            $items = $this->getItems();
            foreach ($items as $item) {
                $itemData = array_merge($item->toArray(), ['order_item_order_id' => $orderId]);
                dispatch_event("filter_order_data", [&$itemData]);

                $conn->getTable('order_item')->insert($itemData);
            }

            // Order activities
            $conn->getTable('order_activity')
                ->insert([
                    'order_activity_order_id' => $orderId,
                    'comment' => 'Order created',
                    'customer_notified' => 0 //TODO: check config of SendGrid
                ]);
            $this->isOrdered = $orderId;

            // Disable cart
            $conn->getTable('cart')
                ->where('cart_id', '=', $this->getData('cart_id'))
                ->update(['status'=>0]);
            $conn->commit();
            $this->destroy();
            return $orderId;
        } catch (\Exception $e) {
            $conn->rollback();
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
        $this->dataSource = [];
        $this->fields = [];
        $this->error = null;

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

    /**
     * @return array
     */
    public function getDataSource(): array
    {
        return $this->dataSource;
    }
}