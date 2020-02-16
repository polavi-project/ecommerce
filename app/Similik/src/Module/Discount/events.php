<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use Similik\Module\Discount\Services\CouponCollection;
use Similik\Module\Discount\Services\Type\CouponCollectionFilterType;
use Similik\Module\Discount\Services\Type\CouponCollectionType;
use Similik\Module\Discount\Services\Type\CouponType;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;

$eventDispatcher->addListener(
        'before_execute_' . strtolower(str_replace('\\', '_', \Similik\Middleware\AdminNavigationMiddleware::class)),
        function (\Similik\Services\Di\Container $container) {
            $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
                'discount',
                'Discount',
                '',
                'tag',
                null,
                10
            );
            $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
                'coupon.grid',
                'All coupon',
                $container->get(Router::class)->generateUrl('coupon.list'),
                'list',
                'discount',
                10
            );
        },
        0
);

$eventDispatcher->addListener(
    'register.checkout.cart.middleware',
    function (\Similik\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Similik\Module\Discount\Middleware\Cart\CouponMiddleware::class, 21);
    },
    0
);

$eventDispatcher->addListener(
    'filter.query.type',
    function (&$fields, Container $container) {
        $fields['coupon'] = [
            'type' => $container->get(CouponType::class),
            'description' => 'Return a coupon',
            'args' => [
                'id' => Type::nonNull(Type::id())
            ],
            'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                if($container->get(Request::class)->isAdmin() == false)
                    return false;

                return _mysql()->getTable('coupon')->load($args['id']);
            }
        ];

        $fields['couponCollection'] = [
            'type' => $container->get(CouponCollectionType::class),
            'description' => "Return list of coupon and total count",
            'args' => [
                'filter' =>  [
                    'type' => $container->get(CouponCollectionFilterType::class)
                ]
            ],
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                if($container->get(Request::class)->isAdmin() == false)
                    return [];
                else
                    return $container->get(CouponCollection::class)->getData($rootValue, $args, $container, $info);
            }
        ];
    },
    5
);