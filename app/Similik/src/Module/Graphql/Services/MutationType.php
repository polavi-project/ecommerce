<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Services;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use function Similik\dispatch_event;
use Similik\Module\Customer\Services\Type\CustomerGroupType;
use Similik\Module\Customer\Services\Type\CustomerType;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;

class MutationType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
        'name' => 'Mutation',
        'fields' => function() use ($container) {
            $fields = [
                'createCustomerGroup' => [
                    'args'=> [
                        'name'=> Type::nonNull(Type::string())
                    ],
                    'type' => new ObjectType([
                        'name'=> 'createGroupOutput',
                        'fields' => [
                            'status' => Type::nonNull(Type::boolean()),
                            'group' => $container->get(CustomerGroupType::class)
                        ]
                    ]),
                    'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                        if(!$container->get(Request::class)->isAdmin())
                            return ['status' => false, 'group'=> null];
                        else {
                            $conn = _mysql();
                            $conn->getTable('customer_group')->insert(['group_name' => $args['name']]);
                            $id = $conn->getLastID();
                            return ['status'=> true, 'group' => $conn->getTable('customer_group')->load($id)];
                        }
                    }
                ],
                'createCustomer' => [
                    'args'=> [
                        'customer' => [
                            'type'=> new InputObjectType([
                                'name'=> 'CustomerInput',
                                'fields'=> function() use ($container) {
                                    $fields = [
                                        'full_name' => Type::string(),
                                        'email' => Type::nonNull(Type::string()),
                                        'password' => Type::nonNull(Type::string()),
                                        'group_id' => Type::int()
                                    ];
                                    dispatch_event('filter.createCustomer.input', [&$fields]);

                                    return $fields;
                                }
                            ])
                        ]
                    ],
                    'type' => new ObjectType([
                        'name'=> 'createCustomerOutput',
                        'fields' => [
                            'status' => Type::nonNull(Type::boolean()),
                            'message'=> Type::string(),
                            'customer' => $container->get(CustomerType::class)
                        ]
                    ]),
                    'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                        $conn = _mysql();
                        $data = $args['customer'];
                        if($conn->getTable('customer')->loadByField('email', $data['email']))
                            return ['status'=> false, 'message'=> "Email is existed", 'customer'=>null];
                        if(!$container->get(Request::class)->isAdmin())
                            $data['group_id'] = 1;
                        dispatch_event('before.insert.customer', [&$data, $container]);
                        $conn->getTable('customer')->insert(array_merge($data, ['password' => password_hash($data['password'], PASSWORD_DEFAULT)]));
                        $id = $conn->getLastID();
                        return ['status'=> true, 'customer' => $conn->getTable('customer')->load($id)];
                    }
                ],
                'updateCustomer' => [
                    'args'=> [
                        'customer' => [
                            'type'=> new InputObjectType([
                                'name'=> 'updateCustomerInput',
                                'fields'=> function() use ($container) {
                                    $fields = [
                                        'full_name' => Type::string(),
                                        'email' => Type::string(),
                                        'password' => Type::string(),
                                        'group_id' => Type::int()
                                    ];
                                    dispatch_event('filter.update_customer.input', [&$fields]);

                                    return $fields;
                                }
                            ])
                        ]
                    ],
                    'type' => new ObjectType([
                        'name'=> 'updateCustomerOutput',
                        'fields' => [
                            'status' => Type::nonNull(Type::boolean()),
                            'message'=> Type::string(),
                            'customer' => $container->get(CustomerType::class)
                        ]
                    ]),
                    'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                        $conn = _mysql();
                        $data = $args['customer'];
                        if(
                            !$container->get(Request::class)->isAdmin() &&
                            $container->get(Request::class)->getCustomer()->getData('customer_id') != $data['customer_id']
                        )
                            return ['status'=> false, 'message'=> "Permission denied", 'customer'=>null];
                        if(
                            $conn->getTable('customer')
                                ->where('email', '=', $data['email'])
                                ->andWhere('customer_id', '<>', $data['customer_id'])
                                ->fetchOneAssoc()
                        )
                            return ['status'=> false, 'message'=> "Email is existed", 'customer'=>null];
                        if(!$container->get(Request::class)->isAdmin())
                            unset($data['group_id']);
                        dispatch_event('before_update_customer', [&$data, $container]);

                        if(isset($data['password']) and $data['password'])
                            $data = array_merge($data, ['password' => password_hash($data['password'], PASSWORD_DEFAULT)]);
                        else {
                            unset($data['password']);
                        }
                        $conn->getTable('customer')->where('customer_id', '=', $data['customer_id'])->update($data);
                        return ['status'=> true, 'customer' => $conn->getTable('customer')->load($data['customer_id'])];
                    }
                ]
            ];

            dispatch_event('filter.mutation.type', [&$fields, $container]);

            return $fields;
        }
    ];
        parent::__construct($config);
    }
}
