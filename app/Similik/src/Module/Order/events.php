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

