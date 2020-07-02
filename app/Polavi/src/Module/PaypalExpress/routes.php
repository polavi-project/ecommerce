<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return [
    [
        'method'   => 'GET',
        'path'     => '/paypal_express/pay',
        'middleware' => [
            \Polavi\Module\Checkout\Middleware\Cart\View\DataMiddleware::class,
            \Polavi\Module\Checkout\Middleware\Cart\View\ResponseMiddleware::class
        ],
        'is_admin' => false
    ],
    [
        'method'   => 'GET',
        'path'     => '/paypal_express/success',
        'middleware' => [
            \Polavi\Module\PaypalExpress\Middleware\Pay\PaymentInitMiddleware::class,
            \Polavi\Module\PaypalExpress\Middleware\Success\ExecutePaymentMiddleware::class
        ],
        'is_admin' => false
    ],
    [
        'method'   => 'GET',
        'path'     => '/paypal_express/failure',
        'middleware' => [
            \Polavi\Module\Checkout\Middleware\Cart\Edit\EditMiddleware::class,
        ],
        'is_admin' => false
    ]
];