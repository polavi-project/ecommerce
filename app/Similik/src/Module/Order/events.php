<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Similik\Services\Di\Container;
use Similik\Services\Routing\Router;

$eventDispatcher->addListener(
        'before_execute_' . strtolower(str_replace('\\', '_', \Similik\Middleware\AdminNavigationMiddleware::class)),
        function (\Similik\Services\Di\Container $container) {
            $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
                'order',
                'Orders',
                '',
                'cart',
                null,
                0
            )->addItem(
                'order.grid',
                'All orders',
                $container->get(Router::class)->generateUrl('order.grid'),
                null,
                'order'
            );
        },
        0
);

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Similik\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddlewareBefore(\Similik\Middleware\PromiseWaiterMiddleware::class, \Similik\Module\Order\Middleware\Update\AddActivityMiddleware::class);
    },
    0
);

$eventDispatcher->addListener(
    'register.dashboard.middleware',
    function (\Similik\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Similik\Module\Order\Middleware\Dashboard\AddRechartsMiddleware::class, 1);
        $middlewareManager->registerMiddleware(\Similik\Module\Order\Middleware\Dashboard\StatisticMiddleware::class, 1);
    },
    0
);

$eventDispatcher->addListener(
    'filter.query.type',
    function (&$fields) use ($container) {
        /**@var array $fields*/
        $fields += [
            'saleStatistic' => [
                'type' => Type::listOf(new ObjectType([
                    'name'=> 'saleStatistic',
                    'fields' => [
                        'time' => Type::nonNull(Type::string()),
                        'count' => Type::nonNull(Type::int()),
                        'amount'=> Type::nonNull(Type::float())
                    ],
                    'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
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
                'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                    $start = null;
                    $date = new DateTime();
                    if($args['period'] == 'daily')
                        $start = $date->modify('-10 days')->format('Y-m-d');
                    if($args['period'] == 'weekly')
                        $start = date('Y-m-d', strtotime('previous monday', strtotime($date->modify('-10 weeks')->format('Y-m-d'))));
                    if($args['period'] == 'monthly')
                        $start = substr($date->modify('-10 months')->format('Y-m-d'), 0, -2) . '01';

                    $orders = \Similik\_mysql()->getTable('order')
                        ->where('created_at', '>=', $start . ' 00:00:00')
                        ->fetchAllAssoc([
                            'sort_order'=> 'ASC'
                        ]);

                    $result = [];
                    $item = [];
                    foreach ($orders as $order) {
                        $amount = $item['amount'] ?? 0;
                        if($args['period'] == 'daily')
                            $time = $date->format('Y-m-d') . ' 23:59:59';
                        if($args['period'] == 'weekly')
                            $time = date('Y-m-d', strtotime('sunday', strtotime($date->format('Y-m-d'))))  . ' 23:59:59';
                        if($args['period'] == 'monthly')
                            $time = date("Y-m-t", strtotime($date->format('Y-m-d')))  . ' 23:59:59';
                        if(!isset($item['time']))
                            $item['time'] = $time;
                        if(new DateTime($order['created_at']) <= new DateTime($time)) {
                            if(isset($item['amount']))
                                $item['amount'] = $item['amount'] + floatval($order['grand_total']);
                            else
                                $item['amount'] = floatval($order['grand_total']);
                        }
                    }
                }
            ]
        ];
    },
    0
);