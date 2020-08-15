<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;
use Polavi\Services\Routing\Router;

class AddressType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'CustomerAddress',
            'fields' => function() use ($container) {
                $fields = [
                    'customer_address_id' => [
                        'type' => Type::id()
                    ],
                    'full_name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'telephone' => [
                        'type' => Type::string()
                    ],
                    'address_1' => [
                        'type' => Type::string()
                    ],
                    'address_2' => [
                        'type' => Type::string()
                    ],
                    'postcode' => [
                        'type' => Type::string()
                    ],
                    'city' => [
                        'type' => Type::string()
                    ],
                    'province' => [
                        'type' => Type::string()
                    ],
                    'country' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'is_default' => [
                        'type' => Type::int()
                    ],
                    'update_url' => [
                        'type' => Type::string(),
                        'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                            if (isset($value['customer_address_id']))
                                return $container->get(Router::class)->generateUrl('customer.address.update', ['id' => $value['customer_address_id']]);
                            else
                                return null;
                        }
                    ],
                    'delete_url' => [
                        'type' => Type::string(),
                        'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                            return isset($value['customer_address_id']) ? $container->get(Router::class)->generateUrl('customer.address.delete', ['id' => $value['customer_address_id']]) : null;
                        }
                    ]
                ];

                dispatch_event('filter.customerAddress.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}