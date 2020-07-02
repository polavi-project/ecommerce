<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return [
    [
        'event'    => 'after_add_routed_middleware',
        'callback' => function (\Polavi\Middleware\HandlerMiddleware $handler, $callable, $next) {
            if($callable instanceof \Polavi\Module\Checkout\Middleware\Checkout\Orderbk\CreateOrderMiddleware) {
                $handler->addMiddleware(new \Polavi\Module\PaypalExpress\Middleware\Pay\CreatePaymentMiddleware(), null);
                $handler->addMiddleware(new \Polavi\Module\PaypalExpress\Middleware\Pay\PaymentInitMiddleware(), null);
            }
            // Online capture
            if($callable instanceof \Polavi\Module\Sale\Middleware\Order\Update\Payment\OfflineCaptureMiddleware) {
                $handler->addMiddleware(new Polavi\Module\PaypalExpress\Middleware\Capture\CaptureMiddleware(), null);
            }
        },
        'priority' => 0
    ]
];