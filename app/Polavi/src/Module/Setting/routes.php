<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */


declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */

$router->addAdminRoute('setting.general', ["POST", "GET"], '/setting/general', [
    \Polavi\Module\Setting\Middleware\General\FormMiddleware::class,
    \Polavi\Module\Setting\Middleware\General\SaveMiddleware::class
]);

$router->addAdminRoute('setting.catalog', ["POST", "GET"], '/setting/catalog', [
    \Polavi\Module\Setting\Middleware\Catalog\FormMiddleware::class,
    \Polavi\Module\Setting\Middleware\Catalog\SaveMiddleware::class
]);

$router->addAdminRoute('setting.payment', ["POST", "GET"], '/setting/payment[/{method}]', [
    \Polavi\Module\Setting\Middleware\Payment\PaymentSettingMiddleware::class,
    \Polavi\Module\Setting\Middleware\Payment\CODFormMiddleware::class,
    \Polavi\Module\Setting\Middleware\Payment\CODSaveMiddleware::class,
]);

$router->addAdminRoute('setting.shipment', ["POST", "GET"], '/setting/shipment[/{method}]', [
    \Polavi\Module\Setting\Middleware\Shipment\ShipmentSettingMiddleware::class,
    \Polavi\Module\Setting\Middleware\Shipment\FlatRateFormMiddleware::class,
    \Polavi\Module\Setting\Middleware\Shipment\FlatRateSaveMiddleware::class,
]);

/* MIGRATION */
$router->addAdminRoute('setting.install', ["POST", "GET"], '/setting/migrate/install', [
    \Polavi\Module\Setting\Middleware\Migrate\InstallMiddleware::class
]);