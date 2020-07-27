<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */

$router->addSiteRoute('checkout.cart', 'GET', '/cart', [
    \Polavi\Module\Checkout\Middleware\Cart\View\ShoppingCartMiddleware::class,
    \Polavi\Module\Checkout\Middleware\Cart\View\ItemsMiddleware::class,
    \Polavi\Module\Checkout\Middleware\Cart\View\SummaryMiddleware::class
]);

$router->addSiteRoute('cart.add', 'POST', '/cart/add', [
    \Polavi\Module\Checkout\Middleware\Cart\Add\AddProductMiddleware::class
]);

$router->addSiteRoute('cart.remove', ["POST", "GET"], '/cart/remove/{id:\d+}', [
    \Polavi\Module\Checkout\Middleware\Cart\Remove\RemoveItemMiddleware::class
]);

$router->addSiteRoute('checkout.index', 'GET', '/checkout', [
    \Polavi\Module\Checkout\Middleware\Checkout\Index\InitMiddleware::class,
    \Polavi\Module\Checkout\Middleware\Checkout\Index\AddressBookMiddleware::class,
    \Polavi\Module\Checkout\Middleware\Checkout\Index\AddressFormMiddleware::class,
    \Polavi\Module\Checkout\Middleware\Checkout\Index\SubmitButtonMiddleware::class,
]);

$router->addSiteRoute('checkout.set.contact', 'POST', '/checkout/contact/add', [
    \Polavi\Module\Checkout\Middleware\Checkout\ContactInfo\AddContactInfoMiddleware::class
]);

$router->addSiteRoute('checkout.set.payment', 'POST', '/checkout/payment/add', [
    \Polavi\Module\Checkout\Middleware\Checkout\Payment\AddPaymentMethodMiddleware::class
]);

$router->addSiteRoute('checkout.set.shipment', 'POST', '/checkout/shipment/add', [
    \Polavi\Module\Checkout\Middleware\Checkout\Shipment\AddShippingMethodMiddleware::class
]);

$router->addSiteRoute('checkout.set.billing.address', 'POST', '/checkout/payment/address/set', [
    \Polavi\Module\Checkout\Middleware\Checkout\Payment\AddBillingAddressMiddleware::class
]);

$router->addSiteRoute('checkout.set.shipping.address', 'POST', '/checkout/shipment/address/set', [
    \Polavi\Module\Checkout\Middleware\Checkout\Shipment\AddShippingAddressMiddleware::class
]);

$router->addSiteRoute('checkout.order', 'POST', '/checkout/order', [
    \Polavi\Module\Checkout\Middleware\Checkout\Order\CreateOrderMiddleware::class,
    \Polavi\Module\Checkout\Middleware\Checkout\Order\ResponseMiddleware::class
]);

$router->addSiteRoute('checkout.success', 'GET', '/checkout/success', [
    \Polavi\Module\Checkout\Middleware\Checkout\Success\MessageMiddleware::class
]);