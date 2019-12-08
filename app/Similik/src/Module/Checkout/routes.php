<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

$router->addAdminRoute('checkout.install', 'POST', '/checkout/migrate/install', [
    \Similik\Module\Checkout\Middleware\Migrate\Install\InstallMiddleware::class
]);

$router->addSiteRoute('checkout.cart', 'GET', '/cart', [
    \Similik\Module\Checkout\Middleware\Cart\View\ShoppingCartMiddleware::class,
    \Similik\Module\Checkout\Middleware\Cart\View\ItemsMiddleware::class,
    \Similik\Module\Checkout\Middleware\Cart\View\SummaryMiddleware::class
]);

$router->addSiteRoute('coupon.add', 'POST', '/cart/coupon/add', [
    \Similik\Module\Checkout\Middleware\Cart\Coupon\AddCouponMiddleware::class
]);

$router->addSiteRoute('coupon.remove', 'POST', '/cart/coupon/remove', [
    \Similik\Module\Checkout\Middleware\Cart\Coupon\AddCouponMiddleware::class
]);

$router->addSiteRoute('cart.add', 'POST', '/cart/add', [
    \Similik\Module\Checkout\Middleware\Cart\Add\AddProductMiddleware::class
]);

$router->addSiteRoute('cart.remove', ["POST", "GET"], '/cart/remove/{id:\d+}', [
    \Similik\Module\Checkout\Middleware\Cart\Remove\RemoveItemMiddleware::class
]);

$router->addSiteRoute('checkout.index', 'GET', '/checkout', [
    \Similik\Module\Checkout\Middleware\Checkout\Index\InitMiddleware::class,
    \Similik\Module\Checkout\Middleware\Checkout\Index\AddressBookMiddleware::class,
    \Similik\Module\Checkout\Middleware\Checkout\Index\AddressFormMiddleware::class,
    \Similik\Module\Checkout\Middleware\Checkout\Index\SubmitButtonMiddleware::class,
]);

$router->addSiteRoute('checkout.set.payment', 'POST', '/checkout/payment/add', [
    \Similik\Module\Checkout\Middleware\Checkout\Payment\AddPaymentMethodMiddleware::class
]);

$router->addSiteRoute('checkout.set.shipment', 'POST', '/checkout/shipment/add', [
    \Similik\Module\Checkout\Middleware\Checkout\Shipment\AddShippingMethodMiddleware::class
]);

$router->addSiteRoute('checkout.order', 'POST', '/checkout/order', [
    \Similik\Module\Checkout\Middleware\Checkout\Order\CreateOrderMiddleware::class,
    \Similik\Module\Checkout\Middleware\Checkout\Order\ResponseMiddleware::class
]);

$router->addSiteRoute('checkout.success', 'GET', '/checkout/success', [
    \Similik\Module\Checkout\Middleware\Checkout\Success\MessageMiddleware::class
]);