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
                        'value'=> Type::nonNull(Type::float())
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
                    $now = new DateTime();
                    $now->setTimezone(new DateTimeZone('UTC'));
                    $end = $now;
                    $result = [];
                    $i = 19;
                    while($i >= 0) {
                        $result[$i]['to'] = $end->format('Y-m-d') . ' 23:59:59';

                        if($args['period'] == 'daily') {
                            $result[$i]['from'] = $end->format('Y-m-d') . " 00:00:00";
                            $end->modify('-1 day');
                            $end = new DateTime($end->format('Y-m-d') . ' 23:59:59');
                        }
                        if($args['period'] == 'weekly')  {
                            $end->modify('+1 day');
                            $result[$i]['from'] = date('Y-m-d', strtotime('previous monday', strtotime($end->format('Y-m-d')))) . ' 00:00:00';
                            $end->modify('-1 day');
                            $end->modify('previous sunday');
                        }
                        if($args['period'] == 'monthly')  {
                            $end->modify('first day of this month');
                            $result[$i]['from'] = $end->format('Y-m-d') . ' 00:00:00';
                            $end->modify('-1 day');
                        }
                        $i--;
                    }
                    $result = array_reverse($result);
                    foreach ($result as $key => $item) {
                        $data = \Similik\_mysql()
                            ->getTable('order')
                            ->addFieldToSelect('SUM(grand_total)', 'total')
                            ->addFieldToSelect('COUNT(order_id)', 'count')
                            ->where('created_at', '>=', $item['from'])
                            ->andWhere('created_at', '<=', $item['to'])
                            ->fetch();
                        $result[$key]['value'] = $data['total'] ?? 0;
                        $result[$key]['count'] = $data['count'] ?? 0;
                        $result[$key]['time'] = substr($result[$key]['to'], 0, -10);
                    }

                    return $result;
                }
            ]
        ];
    },
    0
);