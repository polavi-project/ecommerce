<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

$router->addAdminRoute('order.grid', 'GET', '/orders', [
    \Similik\Module\Order\Middleware\Grid\GridMiddleware::class,
    //\Similik\Module\Order\Middleware\Grid\ButtonMiddleware::class,
]);

/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.edit', 'GET', '/order/edit/{id:\d+}', [
    \Similik\Module\Order\Middleware\Edit\InitMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\InfoMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\ItemsMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\PaymentTransactionMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\ShipmentMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\ActivityMiddleware::class,
]);

/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.offline.pay', 'GET', '/order/pay/offline/{id:\d+}', [
    \Similik\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Payment\PayOfflineMiddleware::class
]);

$router->addAdminRoute('order.offline.refund', 'GET', '/order/refund/offline/{id:\d+}', [
    \Similik\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Payment\PayOfflineMiddleware::class
]);

/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.ship.start', 'GET', '/order/ship/start/{id:\d+}', [
    \Similik\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Shipment\StartShipmentMiddleware::class
]);
/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.ship.complete', 'GET', '/order/ship/complete/{id:\d+}', [
    \Similik\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Shipment\CompleteShipmentMiddleware::class
]);
////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////

