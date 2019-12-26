<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use function Similik\get_config;
use Similik\Module\Checkout\Services\Cart\Cart;

$eventDispatcher->addListener(
    'register.checkout.index.middleware',
    function (\Similik\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Similik\Module\FlatRate\Middleware\Checkout\FlatRateMiddleware::class, 31);
    },
    10
);

$eventDispatcher->addListener(
    'apply_shipping_method',
    function (Similik\Module\Checkout\Services\Cart\Cart $cart, $data) {
//        if($cart->getData('shipping_address_id') == null)
//            return null;

        $shippingAddress = \Similik\_mysql()->getTable('cart_address')->load($cart->getData('shipping_address_id'));
        if(
            isset($data['shipping_method']) and
            $data['shipping_method'] == 'flat_rate' and
            get_config('shipment_flat_rate_status') == 1 and
            (
                in_array($shippingAddress['country'], get_config('shipment_flat_rate_countries', ['US'])) ||
                get_config('shipment_flat_rate_countries', []) == []
            )
        )
            return 'flat_rate';
        else
            return null;
    },
    0
);

$eventDispatcher->addListener(
    'cart_shipping_fee_calculate',
    function (Similik\Module\Checkout\Services\Cart\Cart $cart) {
        if($cart->getData('shipping_method') != 'flat_rate')
            return null;
        $coupon = \Similik\the_container()->get(\Similik\Module\Discount\Services\CouponHelper::class)->getCoupon();
        if($coupon and $coupon['free_shipping'] == 1)
            return 0;
        return get_config('shipment_flat_rate_fee');
    },
    0
);