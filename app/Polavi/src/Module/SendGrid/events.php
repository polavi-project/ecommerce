<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Event\EventDispatcher $eventDispatcher */

use Polavi\Services\Routing\Router;

$eventDispatcher->addListener(
    "admin_menu",
    function (array $items) {
        return array_merge($items, [
            [
                "id" => "setting_sendgrid",
                "sort_order" => 50,
                "url" => \Polavi\generate_url("setting.sendgrid"),
                "title" => "SendGrid",
                "icon" => "mail-bulk",
                "parent_id" => "setting"
            ]
        ]);
    },
    0
);

$eventDispatcher->addListener('register.customer.register.post.middleware', function(\Polavi\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareAfter(\Polavi\Module\Customer\Middleware\Create\CreateAccountMiddleware::class, \Polavi\Module\SendGrid\Middleware\Customer\SendWelcomeEmailMiddleware::class);
});

$eventDispatcher->addListener('register.checkout.order.middleware', function(\Polavi\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareAfter(\Polavi\Module\Checkout\Middleware\Checkout\Order\CreateOrderMiddleware::class, \Polavi\Module\SendGrid\Middleware\Order\SendConfirmationEmailMiddleware::class);
});
