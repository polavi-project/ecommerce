<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

$router->addAdminRoute('customer.grid', 'GET', '/customers', [
    \Similik\Module\Customer\Middleware\Grid\GridMiddleware::class,
]);

$router->addAdminRoute('customer.edit', 'GET', '/customer/edit/{id:\d+}', [
    \Similik\Module\Customer\Middleware\Edit\CustomerInfoMiddleware::class,
]);

$router->addAdminRoute('customer.install', ["POST", "GET"], '/customer/migrate/install', [
    \Similik\Module\Customer\Middleware\Migrate\Install\InstallMiddleware::class
]);

////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////

$router->addSiteRoute('customer.register', 'GET', '/customer/register', [
    \Similik\Module\Customer\Middleware\Register\FormMiddleware::class,
]);

$router->addSiteRoute('customer.register.post', 'POST', '/customer/register', [
    \Similik\Module\Customer\Middleware\Create\CreateAccountMiddleware::class,
    \Similik\Module\Customer\Middleware\Create\LoginMiddleware::class
]);

$router->addSiteRoute('customer.login', 'GET', '/customer/login', [
    \Similik\Module\Customer\Middleware\Login\FormMiddleware::class,
]);

$router->addSiteRoute('customer.dashboard', 'GET', '/customer/dashboard', [
    \Similik\Module\Customer\Middleware\Dashboard\LayoutMiddleware::class,
    \Similik\Module\Customer\Middleware\Dashboard\InfoMiddleware::class,
    \Similik\Module\Customer\Middleware\Dashboard\AddressMiddleware::class,
    \Similik\Module\Customer\Middleware\Dashboard\OrderMiddleware::class,
]);

$router->addSiteRoute('customer.auth', 'POST', '/customer/auth', [
    \Similik\Module\Customer\Middleware\Auth\AuthMiddleware::class,
]);

$router->addSiteRoute('customer.update', 'POST', '/customer/update/{id:\d+}', [
    \Similik\Module\Customer\Middleware\Update\UpdateAccountMiddleware::class,
]);

$router->addSiteRoute('customer.logout', 'GET', '/customer/logout', [
    \Similik\Module\Customer\Middleware\Logout\LogoutMiddleware::class,
]);

// ADDRESS

$router->addSiteRoute('customer.address.create', 'POST', '/customer/address/create', [
    \Similik\Module\Customer\Middleware\Address\CreateMiddleware::class,
]);

$router->addSiteRoute('customer.address.update', 'POST', '/customer/address/update/{id:\d+}', [
    \Similik\Module\Customer\Middleware\Address\UpdateMiddleware::class,
]);

$router->addSiteRoute('customer.address.delete', 'POST', '/customer/address/delete/{id:\d+}', [
    \Similik\Module\Customer\Middleware\Address\DeleteMiddleware::class,
]);