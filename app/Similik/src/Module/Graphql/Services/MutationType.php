<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
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
use Similik\Module\Customer\Services\Type\CustomerInputType;
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
                            $id = $conn->executeQuery("SELECT `AUTO_INCREMENT`
                                FROM  INFORMATION_SCHEMA.TABLES
                                WHERE TABLE_SCHEMA = '" . DB_DATABASE . "'
                                AND TABLE_NAME = 'customer_group'")->fetch();

                            $conn->executeQuery("INSERT INTO customer_group(customer_group_id, group_name) VALUES(?, ?)", [(int)$id[0], $args['name']]);

                            $id = $conn->getLastID();
                            return ['status'=> true, 'group' => $conn->getTable('customer_group')->load($id)];
                        }
                    }
                ],
                'updateCustomerGroup' => [
                    'args'=> [
                        'id' => Type::nonNull(Type::int()),
                        'name'=> Type::nonNull(Type::string())
                    ],
                    'type' => new ObjectType([
                        'name'=> 'updateGroupOutput',
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
                            $group = $conn->getTable('customer_group')->load($args['id']);
                            if(!$group)
                                return ['status' => false, 'group'=> null];
                            $conn->getTable('customer_group')->where('customer_group_id', '=', $args['id'])->update(['group_name'=>$args['name']]);
                            return ['status'=> true, 'group' => $conn->getTable('customer_group')->load($args['id'])];
                        }
                    }
                ],
                'deleteCustomerGroup' => [
                    'args'=> [
                        'id' => Type::nonNull(Type::int())
                    ],
                    'type' => new ObjectType([
                        'name'=> 'deleteGroupOutput',
                        'fields' => [
                            'status' => Type::nonNull(Type::boolean()),
                            'message' => Type::string()
                        ]
                    ]),
                    'resolve'=> function($value, $args, Container $container, ResolveInfo $info) {
                        if(in_array((int)$args['id'], [1, 999, 1000]))
                            return ['status' => false];
                        if(!$container->get(Request::class)->isAdmin())
                            return ['status' => false];
                        else {
                            $conn = _mysql();
                            $group = $conn->getTable('customer_group')->load($args['id']);
                            if(!$group)
                                return ['status' => false];
                            $conn->getTable('customer_group')->where('customer_group_id', '=', $args['id'])->delete();

                            return ['status'=> true];
                        }
                    }
                ],
                'createCustomer' => [
                    'args'=> [
                        'customer' => [
                            'type'=> $container->get(CustomerInputType::class)
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
                            'type'=> $container->get(CustomerInputType::class)
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
                        if(!$container->get(Request::class)->isAdmin()) {
                            unset($data['group_id']);
                            unset($data['status']);
                        }
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
