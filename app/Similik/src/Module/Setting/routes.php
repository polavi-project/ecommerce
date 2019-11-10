<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */


declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

$router->addAdminRoute('setting.general', ["POST", "GET"], '/setting/general', [
    \Similik\Module\Setting\Middleware\General\FormMiddleware::class,
    \Similik\Module\Setting\Middleware\General\SaveMiddleware::class
]);

$router->addAdminRoute('setting.catalog', ["POST", "GET"], '/setting/catalog', [
    \Similik\Module\Setting\Middleware\Catalog\FormMiddleware::class,
    \Similik\Module\Setting\Middleware\Catalog\SaveMiddleware::class
]);

$router->addAdminRoute('setting.payment', ["POST", "GET"], '/setting/payment[/{method}]', [
    \Similik\Module\Setting\Middleware\Payment\PaymentSettingMiddleware::class,
    \Similik\Module\Setting\Middleware\Payment\CODFormMiddleware::class,
    \Similik\Module\Setting\Middleware\Payment\CODSaveMiddleware::class,
]);

$router->addAdminRoute('setting.shipment', ["POST", "GET"], '/setting/shipment[/{method}]', [
    \Similik\Module\Setting\Middleware\Shipment\ShipmentSettingMiddleware::class,
    \Similik\Module\Setting\Middleware\Shipment\FlatRateFormMiddleware::class,
    \Similik\Module\Setting\Middleware\Shipment\FlatRateSaveMiddleware::class,
]);

/* MIGRATION */
$router->addAdminRoute('setting.install', ["POST", "GET"], '/setting/migrate/install', [
    \Similik\Module\Setting\Middleware\Migrate\InstallMiddleware::class
]);