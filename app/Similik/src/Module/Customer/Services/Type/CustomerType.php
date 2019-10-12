<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use function Similik\dispatch_event;
use Similik\Module\Order\Services\Type\OrderType;
use Similik\Services\Di\Container;

class CustomerType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Customer',
            'fields' => function() use ($container) {
                $fields = [
                    'customer_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'group_id' => [
                        'type' => Type::int()
                    ],
                    'status' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'email' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'full_name' => [
                        'type' => Type::string()
                    ],
                    'orders' => [
                        'type' => Type::listOf($container->get(OrderType::class)),
                        'resolve' => function($customer, $args, Container $container, ResolveInfo $info) {
                            return _mysql()->getTable('order')
                                ->where('customer_id', '=', $customer['customer_id'])
                                ->fetchAllAssoc();
                        }
                    ]
                ];

                dispatch_event('filter.customer.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}