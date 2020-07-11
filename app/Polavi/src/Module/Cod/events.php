<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Event\EventDispatcher $eventDispatcher */

$eventDispatcher->addListener(
    'register_order_status_map',
    function (array &$map) {
        $map['cod/pending/pending'] = 'processing';
    },
    0
);

$eventDispatcher->addListener(
    'register.checkout.index.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Polavi\Module\Cod\Middleware\Checkout\CodPaymentMiddleware::class, 31);
    },
    0
);

$eventDispatcher->addListener(
    'register.order.edit.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Polavi\Module\Cod\Middleware\Order\CodPaymentMiddleware::class, 31);
    },
    0
);

$eventDispatcher->addListener(
    'payment_method',
    function ($method, array $context) {
        /**@var \Polavi\Module\Checkout\Services\Cart\Cart $cart*/
        $cart = $context[0];
        $requestingMethod = $cart->getDataSource()['payment_method'] ?? null;
        $subTotal = $cart->getData('sub_total');
        if(
            $requestingMethod == 'cod' and
            \Polavi\get_config('payment_cod_status') == 1 and
            (
                ((int)\Polavi\get_config('payment_cod_minimum') <= $subTotal) and
                ((int)\Polavi\get_config('payment_cod_maximum') == 0 or (int)\Polavi\get_config('payment_cod_maximum') >= $subTotal)
            )
        )
            return 'cod';
        else
            return null;
    },
    0
);
