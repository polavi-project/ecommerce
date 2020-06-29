<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use Similik\Module\Graphql\Services\FilterFieldType;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Similik\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Similik\Module\Customer\Middleware\HeaderIconMiddleware::class, 51);
    },
    5
);

$eventDispatcher->addListener('register.checkout.index.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Similik\Module\Customer\Middleware\Checkout\AccountMiddleware::class, 1);
});

$eventDispatcher->addListener(
    'filter.query.type',
    function (&$fields, Container $container) {
        $fields += [
            'customerCollection' => [
                'type' => $container->get(\Similik\Module\Customer\Services\Type\CustomerCollectionType::class),
                'description' => "Return list of customer and total count",
                'args' => [
                    'filters' =>  Type::listOf($container->get(FilterFieldType::class))
                ],
                'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                    if($container->get(\Similik\Services\Http\Request::class)->isAdmin() == false)
                        return [];
                    $collection = new \Similik\Module\Customer\Services\CustomerCollection($container);
                    return $collection->getData($rootValue, $args, $container, $info);
                }
            ]
        ];

        $fields['customerGroups'] = [
            'type' => Type::listOf($container->get(\Similik\Module\Customer\Services\Type\CustomerGroupType::class)),
            'description' => "Return list of customer group",
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                // Authentication example
                if($container->get(Request::class)->isAdmin() == false)
                    return [];
                else
                    return \Similik\_mysql()->getTable('customer_group')->where('customer_group_id', '<', 999)->fetchAllAssoc();
            }
        ];

        $fields['customer'] = [
            'type' => $container->get(\Similik\Module\Customer\Services\Type\CustomerType::class),
            'description' => "Return a customer",
            'args' => [
                'id' => Type::nonNull(Type::int())
            ],
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                // Authentication example
                if(
                    $container->get(Request::class)->isAdmin() == false &&
                    $args['id'] != $container->get(Request::class)->getCustomer()->getData('customer_id')
                )
                    return null;
                else if(
                    $container->get(Request::class)->isAdmin() == false &&
                    $args['id'] == $container->get(Request::class)->getCustomer()->getData('customer_id')
                )
                    return $container->get(Request::class)->getCustomer()->toArray();
                else
                    return \Similik\_mysql()->getTable('customer')->load($args['id']);
            }
        ];

        $fields['customerAddresses'] = [
            'type' => Type::listOf($container->get(\Similik\Module\Customer\Services\Type\AddressType::class)),
            'description' => "Return a list of customer addresses",
            'args' => [
                'customerId' => Type::nonNull(Type::int())
            ],
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                // Authentication example
                if(
                    $container->get(Request::class)->isAdmin() == false &&
                    $args['customerId'] != $container->get(Request::class)->getCustomer()->getData('customer_id')
                )
                    return [];
                return \Similik\_mysql()->getTable('customer_address')->where('customer_id', '=', $args['customerId'])->fetchAllAssoc();
            }
        ];
    },
    5
);

$eventDispatcher->addListener(
    'filter.mutation.type',
    function (&$fields, Container $container) {
        $fields['createCustomerAddress'] = [
            'args' => [
                'address' => [
                    'type' => $container->get(\Similik\Module\Customer\Services\Type\AddressInputType::class)
                ],
                'customerId' => Type::nonNull(Type::int())
            ],
            'type' => new ObjectType([
                'name'=> 'createCustomerAddressOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'address' => $container->get(\Similik\Module\Customer\Services\Type\AddressType::class)
                ]
            ]),
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                $data = $args['address'];
                if(
                    $container->get(Request::class)->isAdmin() == false &&
                    !$container->get(Request::class)->getCustomer()->isLoggedIn()
                )
                    return ['status'=> false, 'address' => null, 'message' => 'Permission denied'];
                if(
                    $container->get(Request::class)->isAdmin() == false &&
                    $container->get(Request::class)->getCustomer()->isLoggedIn()
                ) {
                    $conn->getTable('customer_address')->insert(array_merge($data, ['customer_id' => $container->get(Request::class)->getCustomer()->getData('customer_id')]));
                    $id = $conn->getLastID();
                    return ['status'=> true, 'address' => $conn->getTable('customer_address')->load($id)];
                }
                else if(!$args['customerId'])
                    return ['status'=> false, 'address' => null, 'message' => 'customerId must be provided'];
                else {
                    $conn->getTable('customer_address')->insert(array_merge($data, ['customer_id' => $args['customerId']]));
                    $id = $conn->getLastID();
                    return ['status'=> true, 'address' => $conn->getTable('customer_address')->load($id)];
                }
            }
        ];

        $fields['updateCustomerAddress'] = [
            'args' => [
                'id' => [
                    'type' => Type::nonNull(Type::int())
                ],
                'address' => [
                    'type' => $container->get(\Similik\Module\Customer\Services\Type\AddressInputType::class)
                ]
            ],
            'type' => new ObjectType([
                'name'=> 'updateCustomerAddressOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'address' => $container->get(\Similik\Module\Customer\Services\Type\AddressType::class)
                ]
            ]),
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                $address = $conn->getTable('customer_address')->load($args['id']);
                if(!$address)
                    return ['status'=> false, 'address' => null, 'message' => 'Address is not existed'];
                if(
                    $container->get(Request::class)->isAdmin() == false &&
                    $address['customer_id'] != $container->get(Request::class)->getCustomer()->getData('customer_id')
                )
                    return ['status'=> false, 'address' => null, 'message' => 'Permission denied'];
                $conn->getTable('customer_address')->where('customer_address_id', '=', $args['id'])->update($args['address']);
                return ['status'=> true, 'address' => $conn->getTable('customer_address')->load($args['id'])];
            }
        ];

        $fields['deleteCustomerAddress'] = [
            'args' => [
                'id' => [
                    'type' => Type::nonNull(Type::int())
                ]
            ],
            'type' => new ObjectType([
                'name'=> 'deleteCustomerAddressOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'addressId' => Type::nonNull(Type::int())
                ]
            ]),
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                $address = $conn->getTable('customer_address')->load($args['id']);
                if(!$address)
                    return ['status'=> false, 'addressId' => null, 'message' => 'Address is not existed'];
                if(
                    $container->get(Request::class)->isAdmin() == false &&
                    $address['customer_id'] != $container->get(Request::class)->getCustomer()->getData('customer_id')
                )
                    return ['status'=> false, 'addressId' => null, 'message' => 'Permission denied'];
                $conn->getTable('customer_address')->where('customer_address_id', '=', $args['id'])->delete();
                return ['status'=> true, 'addressId' => $args['id']];
            }
        ];
    },
    5
);

$eventDispatcher->addListener(
    "admin_menu",
    function (array $items) {
        return array_merge($items, [
            [
                "id" => "customer",
                "sort_order" => 30,
                "url" => null,
                "title" => "Customer",
                "parent_id" => null
            ],
            [
                "id" => "customer_customers",
                "sort_order" => 10,
                "url" => \Similik\generate_url("customer.grid"),
                "title" => "Customers",
                "icon" => "users",
                "parent_id" => "customer"
            ]
        ]);
    },
    0
);