<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */


declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

$router->addAdminRoute('tax.class.list', 'GET', '/taxes', [
    \Similik\Module\Tax\Middleware\Edit\TaxClassMiddleware::class
]);

$router->addAdminRoute('tax.class.save', "POST", '/tax/save', [
    \Similik\Module\Tax\Middleware\Save\SaveMiddleware::class
]);

$router->addAdminRoute('tax.install', ["POST", "GET"], '/tax/migrate/install', [
    \Similik\Module\Tax\Middleware\Migrate\Install\InstallMiddleware::class
]);