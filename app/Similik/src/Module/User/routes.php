<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);
/** @var \Similik\Services\Routing\Router $router */

$router->addAdminRoute('admin.login', 'GET', '/login', [
    \Similik\Module\User\Middleware\Login\ValidateMiddleware::class,
    \Similik\Module\User\Middleware\Login\FormMiddleware::class
]);

$router->addAdminRoute('admin.authenticate', 'POST', '/authenticate', [
    \Similik\Module\User\Middleware\Authenticate\AuthenticateMiddleware::class
]);

$router->addAdminRoute('admin.logout', 'GET', '/logout', [
    \Similik\Module\User\Middleware\Authenticate\LogoutMiddleware::class
]);