<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Module\Catalog\Services\Type\Price;
use Similik\Services\Di\Container;
use Similik\Services\Routing\Router;

class CartItemType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Cart item',
            'fields' => function() use ($container) {
                $fields = [
                    'cart_item_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'product_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'product_name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'product_thumbnail' => [
                        'type' => Type::string()
                    ],
                    'product_sku' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'product_weight' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'product_price' => [
                        'type' => $container->get(Price::class)
                    ],
                    'product_price_incl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'qty' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'final_price' => [
                        'type' => $container->get(Price::class)
                    ],
                    'final_price_incl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'tax_percent' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'tax_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'discount_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'product_custom_options' => [
                        'type' => Type::listOf($container->get(ItemCustomOptionType::class))
                    ],
                    'total' => [
                        'type' => Type::nonNull($container->get(Price::class))
                    ],
                    'productUrl' => [
                        'type' => Type::nonNull(Type::string()),
                        'resolve' => function($item, $args, Container $container, ResolveInfo $info) {
                        }
                    ],
                    'error' => [
                        'type' => Type::string()
                    ]
                ];

                dispatch_event('filter.cart_item.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}