<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class AdvancedPriceType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Advanced price',
            'fields' => function() use ($container) {
                $fields = [
                    'product_price_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'product_price_product_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'price' => [
                        'type' => $container->get(Price::class)
                    ],
                    'customer_group_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'qty' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'active_from' => [
                        'type' => Type::string()
                    ],
                    'active_to' => [
                        'type' => Type::string()
                    ]
                ];

                dispatch_event('filter.advanced_price.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}