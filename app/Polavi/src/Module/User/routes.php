<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);
/** @var \Polavi\Services\Routing\Router $router */

$router->addAdminRoute('admin.login', 'GET', '/login', [
    \Polavi\Module\User\Middleware\Login\ValidateMiddleware::class,
    \Polavi\Module\User\Middleware\Login\FormMiddleware::class
]);

$router->addAdminRoute('admin.authenticate', 'POST', '/authenticate', [
    \Polavi\Module\User\Middleware\Authenticate\AuthenticateMiddleware::class
]);

$router->addAdminRoute('admin.logout', 'GET', '/logout', [
    \Polavi\Module\User\Middleware\Authenticate\LogoutMiddleware::class
]);