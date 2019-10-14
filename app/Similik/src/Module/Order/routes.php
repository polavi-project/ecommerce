<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

use Similik\Module\Order\Middleware\Update\Payment\Payoffline\AddActivityMiddleware;
use Similik\Module\Order\Middleware\Update\Payment\Payoffline\AddTransactionMiddleware;
use Similik\Module\Order\Middleware\Update\Payment\Payoffline\PayMiddleware;

$router->addAdminRoute('order.grid', 'GET', '/orders', [
    \Similik\Module\Order\Middleware\Grid\GridMiddleware::class,
    //\Similik\Module\Order\Middleware\Grid\ButtonMiddleware::class,
]);

/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.edit', 'GET', '/order/edit/{id:\d+}', [
    \Similik\Module\Order\Middleware\Edit\InitMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\ItemsMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\PaymentMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\ShipmentMiddleware::class,
    \Similik\Module\Order\Middleware\Edit\ActivityMiddleware::class,
]);

/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.offline.pay', 'GET', '/order/payoffline/{id:\d+}', [
    \Similik\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Payment\Payoffline\PayMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Payment\Payoffline\AddTransactionMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Payment\Payoffline\AddActivityMiddleware::class,
    \Similik\Module\Order\Middleware\Update\UpdateOrderStatusMiddleware::class
]);

/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.ship.start', 'GET', '/order/ship/start/{id:\d+}', [
    \Similik\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Shipment\StartShipmentMiddleware::class,
    \Similik\Module\Order\Middleware\Update\UpdateOrderStatusMiddleware::class
]);
/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('order.ship.complete', 'GET', '/order/ship/complete/{id:\d+}', [
    \Similik\Module\Order\Middleware\Update\InitPromiseMiddleware::class,
    \Similik\Module\Order\Middleware\Update\Shipment\CompleteShipmentMiddleware::class,
    \Similik\Module\Order\Middleware\Update\UpdateOrderStatusMiddleware::class
]);
////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////

