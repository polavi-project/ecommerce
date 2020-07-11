<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */


declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */

$router->addAdminRoute('tax.class.list', 'GET', '/taxes', [
    \Polavi\Module\Tax\Middleware\Edit\TaxClassMiddleware::class
]);

$router->addAdminRoute('tax.class.save', "POST", '/tax/save', [
    \Polavi\Module\Tax\Middleware\Save\SaveMiddleware::class
]);

$router->addAdminRoute('tax.install', ["POST", "GET"], '/tax/migrate/install', [
    \Polavi\Module\Tax\Middleware\Migrate\Install\InstallMiddleware::class
]);