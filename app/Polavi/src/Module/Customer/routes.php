<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */

$router->addAdminRoute('customer.grid', 'GET', '/customers', [
    \Polavi\Module\Customer\Middleware\Grid\GridMiddleware::class,
]);

$router->addAdminRoute('customer.edit', 'GET', '/customer/edit/{id:\d+}', [
    \Polavi\Module\Customer\Middleware\Edit\CustomerInfoMiddleware::class,
]);

$router->addAdminRoute('customer.install', ["POST", "GET"], '/customer/migrate/install', [
    \Polavi\Module\Customer\Middleware\Migrate\Install\InstallMiddleware::class
]);

////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////

$router->addSiteRoute('customer.register', 'GET', '/customer/register', [
    \Polavi\Module\Customer\Middleware\Register\FormMiddleware::class,
]);

$router->addSiteRoute('customer.register.post', 'POST', '/customer/register', [
    \Polavi\Module\Customer\Middleware\Create\CreateAccountMiddleware::class,
    \Polavi\Module\Customer\Middleware\Create\LoginMiddleware::class
]);

$router->addSiteRoute('customer.login', 'GET', '/customer/login', [
    \Polavi\Module\Customer\Middleware\Login\FormMiddleware::class,
]);

$router->addSiteRoute('customer.dashboard', 'GET', '/customer/dashboard', [
    \Polavi\Module\Customer\Middleware\Dashboard\LayoutMiddleware::class,
    \Polavi\Module\Customer\Middleware\Dashboard\InfoMiddleware::class,
    \Polavi\Module\Customer\Middleware\Dashboard\AddressMiddleware::class,
    \Polavi\Module\Customer\Middleware\Dashboard\OrderMiddleware::class,
]);

$router->addSiteRoute('customer.auth', 'POST', '/customer/auth', [
    \Polavi\Module\Customer\Middleware\Auth\AuthMiddleware::class,
]);

$router->addSiteRoute('customer.update', 'POST', '/customer/update/{id:\d+}', [
    \Polavi\Module\Customer\Middleware\Update\UpdateAccountMiddleware::class,
]);

$router->addSiteRoute('customer.logout', ["GET"], '/customer/logout', [
    \Polavi\Module\Customer\Middleware\Logout\LogoutMiddleware::class,
]);

// ADDRESS

$router->addSiteRoute('customer.address.create', 'POST', '/customer/address/create', [
    \Polavi\Module\Customer\Middleware\Address\CreateMiddleware::class,
]);

$router->addSiteRoute('customer.address.update', 'POST', '/customer/address/update/{id:\d+}', [
    \Polavi\Module\Customer\Middleware\Address\UpdateMiddleware::class,
]);

$router->addSiteRoute('customer.address.delete', 'POST', '/customer/address/delete/{id:\d+}', [
    \Polavi\Module\Customer\Middleware\Address\DeleteMiddleware::class,
]);