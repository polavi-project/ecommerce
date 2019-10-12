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
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class CustomerAddressType extends ObjectType
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