<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);
/** @var \Polavi\Services\Routing\Router $router */

$router->addSiteRoute('migration.install.form', 'GET', '/install', [
    \Polavi\Module\Migration\Middleware\Form\FormMiddleware::class
]);

$router->addSiteRoute('migration.install.post', 'POST', '/install/post', [
    \Polavi\Module\Migration\Middleware\Post\CreateConfigFileMiddleware::class,
    \Polavi\Module\Migration\Middleware\Post\CreateMigrationTableMiddleware::class,
    \Polavi\Module\Migration\Middleware\Post\CreateAdminUserMiddleware::class
]);

$router->addAdminRoute('migration.install.finish', 'POST', '/install/finish', [
    \Polavi\Module\Migration\Middleware\Finish\FinishMiddleware::class
]);

$router->addAdminRoute('migration.module.install', ["GET", "POST"], '/migration/module/install/{module}', [
    \Polavi\Module\Migration\Middleware\Module\Install\ValidateMiddleware::class,
    \Polavi\Module\Migration\Middleware\Module\Install\InstallMiddleware::class
]);