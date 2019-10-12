<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

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
            $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
                'add.coupon',
                'Add new coupon',
                $container->get(Router::class)->generateUrl('coupon.create'),
                'plus',
                'discount',
                20
            );
        },
        0
);
