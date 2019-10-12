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
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Module\Checkout\Services\Cart\Item;
use Similik\Services\Di\Container;

class PaymentMethodType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Cart',
            'fields' => function() use ($container) {
                $fields = [
                    'id' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'customer_id' => [
                        'type' => Type::int()
                    ],
                    'customer_group_id' => [
                        'type' => Type::int()
                    ],
                    'user_ip' => [
                        'type' => Type::string()
                    ],
                    'user_agent' => [
                        'type' => Type::string()
                    ],
                    'status' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'total_qty' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'total_weight' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'shipping_fee_excl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'shipping_fee_incl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'coupon' => [
                        'type' => Type::string()
                    ],
                    'discount_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'tax_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'sub_total' => [
                        'type' => $container->get(Price::class)
                    ],
                    'grand_total' => [
                        'type' => $container->get(Price::class)
                    ],
                    'shipping_method' => [
                        'type' => Type::string()
                    ],
                    'shipping_note' => [
                        'type' => Type::string()
                    ],
                    'items' => [
                        'type' => Type::listOf($container->get(CartItemType::class)),
                        'resolve' => function($cart, $args, Container $container, ResolveInfo $info) {
                            $items = [];
                            /**@var Item $item */
                            foreach ($container->get(Cart::class)->getItems() as $item)
                                $items[] = $item->toArray() + ['error' => $item->getError()];

                            return $items;
                        }
                    ],
                    'item_count' => [
                        'type' => Type::nonNull(Type::int()),
                        'resolve' => function($cart, $args, Container $container, ResolveInfo $info) {
                            return isset($cart['items']) ? count($cart['items']) : 0;
                        }
                    ]
                ];

                dispatch_event('filter.cart.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}