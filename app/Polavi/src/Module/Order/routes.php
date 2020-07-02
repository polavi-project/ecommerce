<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */

$router->addAdminRoute('order.grid', 'GET', '/orders', [
    \Polavi\Module\Order\Middleware\Grid\GridMiddleware::class,
    //\Polavi\Module\Order\Middleware\Grid\ButtonMiddleware::class,
]);

/** @var \Polavi\Services\Routing\Router $router */
$router->addAdminRoute('order.edit', 'GET', '/order/edit/{id:\d+}', [
    \Polavi\Module\Order\Middleware\Edit\InitMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\InfoMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\ItemsMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\ShippingAddressMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\BillingAddressMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\PaymentMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\ShipmentMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\ActivityMiddleware::class,
    \Polavi\Module\Order\Middleware\Edit\SummaryMiddleware::class,
]);

/** @var \Polavi\Services\Routing\Router $router */
$router->addAdminRoute('order.offline.pay', 'GET', '/order/pay/offline/{id:\d+}', [
    \Polavi\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Polavi\Module\Order\Middleware\Update\Payment\PayOfflineMiddleware::class
]);

$router->addAdminRoute('order.offline.refund', 'GET', '/order/refund/offline/{id:\d+}', [
    \Polavi\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Polavi\Module\Order\Middleware\Update\Payment\RefundOfflineMiddleware::class
]);

/** @var \Polavi\Services\Routing\Router $router */
$router->addAdminRoute('order.ship.start', 'GET', '/order/ship/start/{id:\d+}', [
    \Polavi\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Polavi\Module\Order\Middleware\Update\Shipment\StartShipmentMiddleware::class
]);
/** @var \Polavi\Services\Routing\Router $router */
$router->addAdminRoute('order.ship.complete', 'GET', '/order/ship/complete/{id:\d+}', [
    \Polavi\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Polavi\Module\Order\Middleware\Update\Shipment\CompleteShipmentMiddleware::class
]);
////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////

