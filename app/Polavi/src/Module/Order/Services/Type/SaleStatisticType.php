<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use Polavi\Module\Catalog\Services\Type\Price;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Services\Routing\Router;

class SaleStatisticType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'SaleStatistic',
            'fields' => function() use ($container) {
                $fields = [
                    'category' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'value' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'cart_id' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'currency' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'customer_id' => [
                        'type' => Type::int()
                    ],
                    'customer_email' => [
                        'type' => Type::string()
                    ],
                    'customer_full_name' => [
                        'type' => Type::string()
                    ],
                    'customer_dob' => [
                        'type' => Type::string()
                    ],
                    'customer_gender' => [
                        'type' => Type::string()
                    ],
                    'user_ip' => [
                        'type' => Type::string()
                    ],
                    'user_agent' => [
                        'type' => Type::string()
                    ],
                    'coupon' => [
                        'type' => Type::string()
                    ],
                    'shipping_fee_excl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'shipping_fee_incl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'discount_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'sub_total' => [
                        'type' => $container->get(Price::class)
                    ],
                    'total_qty' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'total_weight' => [
                        'type' => Type::string()
                    ],
                    'tax_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'shipping_note' => [
                        'type' => Type::string()
                    ],
                    'shipping_method' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'payment_method' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'shipment_status' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'payment_status' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'grand_total' => [
                        'type' => Type::nonNull($container->get(Price::class))
                    ],
                    'created_at' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'updated_at' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'items' => [
                        'type' => Type::listOf($container->get(OrderItemType::class)),
                        'resolve' => function($order, $args, Container $container, ResolveInfo $info) {
                            return _mysql()
                                ->getTable('order_item')
                                ->where('order_item_order_id', '=', $order['order_id'])
                                ->fetchAllAssoc();
                        }
                    ],
                    'activities' => [
                        'type' => Type::listOf($container->get(OrderActivityType::class)),
                        'resolve' => function($order, $args, Container $container, ResolveInfo $info) {
                            $activities = _mysql()
                                ->getTable('order_activity')
                                ->where('order_activity_order_id', '=', $order['order_id']);

                            if ($container->get(Request::class)->isAdmin() == false)
                                $activities->andWhere('customer_notified', '=', 1);

                            return $activities->fetchAllAssoc();
                        }
                    ],
                    'editUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($order, $args, Container $container, ResolveInfo $info) {
                            if ($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('order.edit', ["id"=>$order['order_id']]);
                        }
                    ]
                ];

                dispatch_event('filter.order.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}