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
                'setting',
                'Setting',
                '',
                'cog',
                null,
                30
            )->addItem(
                'setting.general',
                'General',
                $container->get(Router::class)->generateUrl('setting.general'),
                'settings',
                'setting'
            )->addItem(
                'setting.payment',
                'Payment',
                $container->get(Router::class)->generateUrl('setting.payment'),
                'credit-card',
                'setting'
            )->addItem(
                'setting.shipment',
                'Shipment',
                $container->get(Router::class)->generateUrl('setting.shipment'),
                'cart',
                'setting'
            );
        },
        0
);
