<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use Similik\Services\Routing\Router;

$eventDispatcher->addListener(
    "admin_menu",
    function (array $items) {
        return array_merge($items, [
            [
                "id" => "setting_sendgrid",
                "sort_order" => 50,
                "url" => \Similik\generate_url("setting.sendgrid"),
                "title" => "SendGrid",
                "icon" => "mail-bulk",
                "parent_id" => "setting"
            ]
        ]);
    },
    0
);

$eventDispatcher->addListener('register.customer.register.post.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareAfter(\Similik\Module\Customer\Middleware\Create\CreateAccountMiddleware::class, \Similik\Module\SendGrid\Middleware\Customer\SendWelcomeEmailMiddleware::class);
});

$eventDispatcher->addListener('register.checkout.order.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareAfter(\Similik\Module\Checkout\Middleware\Checkout\Order\CreateOrderMiddleware::class, \Similik\Module\SendGrid\Middleware\Order\SendConfirmationEmailMiddleware::class);
});
