<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return [
    [
        'method'   => 'GET',
        'path'     => '/paypal_express/pay',
        'middleware' => [
            \Similik\Module\Checkout\Middleware\Cart\View\DataMiddleware::class,
            \Similik\Module\Checkout\Middleware\Cart\View\ResponseMiddleware::class
        ],
        'is_admin' => false
    ],
    [
        'method'   => 'GET',
        'path'     => '/paypal_express/success',
        'middleware' => [
            \Similik\Module\PaypalExpress\Middleware\Pay\PaymentInitMiddleware::class,
            \Similik\Module\PaypalExpress\Middleware\Success\ExecutePaymentMiddleware::class
        ],
        'is_admin' => false
    ],
    [
        'method'   => 'GET',
        'path'     => '/paypal_express/failure',
        'middleware' => [
            \Similik\Module\Checkout\Middleware\Cart\Edit\EditMiddleware::class,
        ],
        'is_admin' => false
    ]
];