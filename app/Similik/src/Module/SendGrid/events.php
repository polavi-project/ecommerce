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
                'setting.sendgrid',
                'SendGrid',
                $container->get(Router::class)->generateUrl('setting.sendgrid'),
                'mail',
                'setting'
            );
        },
        0
);

$eventDispatcher->addListener('register.customer.register.post.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareAfter(\Similik\Module\Customer\Middleware\Create\CreateAccountMiddleware::class, \Similik\Module\SendGrid\Middleware\Customer\SendWelcomeEmailMiddleware::class);
});

$eventDispatcher->addListener('register.checkout.order.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareAfter(\Similik\Module\Checkout\Middleware\Checkout\Order\CreateOrderMiddleware::class, \Similik\Module\SendGrid\Middleware\Order\SendConfirmationEmailMiddleware::class);
});
