<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return [
    [
        'event'    => 'after_add_routed_middleware',
        'callback' => function (\Similik\Middleware\HandlerMiddleware $handler, $callable, $next) {
            if($callable instanceof \Similik\Module\Checkout\Middleware\Checkout\Orderbk\CreateOrderMiddleware) {
                $handler->addMiddleware(new \Similik\Module\PaypalExpress\Middleware\Pay\CreatePaymentMiddleware(), null);
                $handler->addMiddleware(new \Similik\Module\PaypalExpress\Middleware\Pay\PaymentInitMiddleware(), null);
            }
            // Online capture
            if($callable instanceof \Similik\Module\Sale\Middleware\Order\Update\Payment\OfflineCaptureMiddleware) {
                $handler->addMiddleware(new Similik\Module\PaypalExpress\Middleware\Capture\CaptureMiddleware(), null);
            }
        },
        'priority' => 0
    ]
];