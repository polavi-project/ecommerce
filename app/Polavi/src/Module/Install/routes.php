<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);
/** @var \Polavi\Services\Routing\Router $router */

$router->addSiteRoute('polavi.install.form', 'GET', '/install', [
    \Polavi\Module\Install\Middleware\Form\FormMiddleware::class
]);

$router->addSiteRoute('polavi.install.post', 'POST', '/install/post', [
    \Polavi\Module\Install\Middleware\Post\CreateConfigFileMiddleware::class,
    \Polavi\Module\Install\Middleware\Post\CreateAdminUserMiddleware::class
]);

$router->addAdminRoute('polavi.install.finish', 'POST', '/install/finish', [
    \Polavi\Module\Install\Middleware\Finish\FinishMiddleware::class
]);