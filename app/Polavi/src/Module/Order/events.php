<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Polavi\Module\Order\Services\OrderCollection;
use Polavi\Module\Order\Services\Type\OrderCollectionFilterType;
use Polavi\Module\Order\Services\Type\OrderCollectionType;
use Polavi\Module\Order\Services\Type\OrderType;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Module\Catalog\Services\Type\ProductType;

$eventDispatcher->addListener(
        "admin_menu",
        function (array $items) {
            return array_merge($items, [
                [
                    "id" => "order",
                    "sort_order" => 10,
                    "url" => null,
                    "title" => "Sale",
                    "parent_id" => null
                ],
                [
                    "id" => "order_grid",
                    "sort_order" => 10,
                    "url" => \Polavi\generate_url("order.grid"),
                    "title" => "Orders",
                    "icon" => "shopping-bag",
                    "parent_id" => "order"
                ]
            ]);
        },
        0
);

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddlewareBefore(\Polavi\Middleware\PromiseWaiterMiddleware::class, \Polavi\Module\Order\Middleware\Update\AddActivityMiddleware::class);
        $middlewareManager->registerMiddleware(\Polavi\Module\Order\Middleware\Dashboard\AddRechartsMiddleware::class, 1);
    },
    0
);

$eventDispatcher->addListener(
    'register.dashboard.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Polavi\Module\Order\Middleware\Dashboard\StatisticMiddleware::class, 1);
        $middlewareManager->registerMiddleware(\Polavi\Module\Order\Middleware\Dashboard\BestSellersMiddleware::class, 1);
        $middlewareManager->registerMiddleware(\Polavi\Module\Order\Middleware\Dashboard\LifetimeSaleMiddleware::class, 1);
        $middlewareManager->registerMiddleware(\Polavi\Module\Order\Middleware\Dashboard\BestCustomersMiddleware::class, 1);
    },
    0
);

$eventDispatcher->addListener(
    'filter.query.type',
    function (&$fields) {
        /**@var array $fields*/
        $fields += [
            'order' => [
                'type' => \Polavi\the_container()->get(OrderType::class),
                'description' => "Return an order",
                'args' => [
                    'id' =>  Type::nonNull(Type::int())
                ],
                'resolve' => function ($rootValue, $args, Container $container, ResolveInfo $info) {
                    // Authentication example
                    if ($container->get(Request::class)->isAdmin() == false) {
                        return null;
                    } else {
                        return $container->get(\Polavi\Module\Order\Services\OrderLoader::class)->load($args['id']);
                    }
                }
            ],
            'orderCollection' => [
                'type' => \Polavi\the_container()->get(OrderCollectionType::class),
                'description' => "Return list of order and total count",
                'args' => [
                    'filter' =>  [
                        'type' => \Polavi\the_container()->get(OrderCollectionFilterType::class)
                    ]
                ],
                'resolve' => function ($rootValue, $args, Container $container, ResolveInfo $info) {
                    if ($container->get(Request::class)->isAdmin() == false)
                        return [];
                    else
                        return $container->get(OrderCollection::class)->getData($rootValue, $args, $container, $info);
                }
            ],
            'saleStatistic' => [
                'type' => Type::listOf(new ObjectType([
                    'name'=> 'saleStatistic',
                    'fields' => [
                        'time' => Type::nonNull(Type::string()),
                        'count' => Type::nonNull(Type::int()),
                        'value'=> Type::nonNull(Type::float())
                    ],
                    'resolveField' => function ($value, $args, Container $container, ResolveInfo $info) {
                        return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
                    }
                ])),
                'description' => "Return sale statistic information",
                'args' => [
                    'period' => new \GraphQL\Type\Definition\EnumType([
                        'name' => 'Period',
                        'description' => 'Period',
                        'values' => [
                            'daily' => [
                                'value' => 'daily'
                            ],
                            'weekly' => [
                                'value' => 'weekly'
                            ],
                            'monthly' => [
                                'value' => 'monthly'
                            ],
                        ]
                    ])
                ],
                'resolve' => function ($rootValue, $args, Container $container, ResolveInfo $info) {
                    $now = new DateTime();
                    $now->setTimezone(new DateTimeZone('UTC'));
                    $end = $now;
                    $result = [];
                    $i = 19;
                    while($i >= 0) {
                        $result[$i]['to'] = $end->format('Y-m-d') . ' 23:59:59';

                        if ($args['period'] == 'daily') {
                            $result[$i]['from'] = $end->format('Y-m-d') . " 00:00:00";
                            $end->modify('-1 day');
                            $end = new DateTime($end->format('Y-m-d') . ' 23:59:59');
                        }
                        if ($args['period'] == 'weekly') {
                            $end->modify('+1 day');
                            $result[$i]['from'] = date('Y-m-d', strtotime('previous monday', strtotime($end->format('Y-m-d')))) . ' 00:00:00';
                            $end->modify('-1 day');
                            $end->modify('previous sunday');
                        }
                        if ($args['period'] == 'monthly') {
                            $end->modify('first day of this month');
                            $result[$i]['from'] = $end->format('Y-m-d') . ' 00:00:00';
                            $end->modify('-1 day');
                        }
                        $i--;
                    }
                    $result = array_reverse($result);
                    foreach ($result as $key => $item) {
                        $data = \Polavi\_mysql()
                            ->getTable('order')
                            ->addFieldToSelect('SUM(grand_total)', 'total')
                            ->addFieldToSelect('COUNT(order_id)', 'count')
                            ->where('created_at', '>=', $item['from'])
                            ->andWhere('created_at', '<=', $item['to'])
                            ->fetch();
                        $result[$key]['value'] = $data['total'] ?? 0;
                        $result[$key]['count'] = $data['count'] ?? 0;
                        $result[$key]['time'] = date('M j', strtotime($result[$key]['to']));
                    }

                    return $result;
                }
            ],
            'bestSellers' => [
                'type' => Type::listOf(\Polavi\the_container()->get(ProductType::class)),
                'description' => "Return list of best seller product",
                'args' => [
                    'limit' => Type::nonNull(Type::int())
                ],
                'resolve' => function ($rootValue, $args, Container $container, ResolveInfo $info) {
                    $ps = \Polavi\_mysql()->getTable('product')
                        ->addFieldToSelect("*")
                        ->addFieldToSelect("SUM(`order_item`.qty)", "saleqty")
                        ->leftJoin('product_description')
                        ->leftJoin('order_item', null, [
                            [
                                'column'      => "order_item.order_item_id",
                                'operator'    => "IS NOT",
                                'value'       => null,
                                'ao'          => 'and',
                                'start_group' => null,
                                'end_group'   => null
                            ]
                        ])
                        ->groupBy("`order_item`.product_id")
                        ->fetchAssoc([
                            "sort_by" => "saleqty",
                            "sort_order" => "DESC",
                            "limit" => $args["limit"]
                        ]);
                    array_walk($ps, function (&$p) {
                        $p["qty"] = $p["saleqty"];
                        return $p;
                    });

                    return $ps;
                }
            ]
        ];
    },
    0
);