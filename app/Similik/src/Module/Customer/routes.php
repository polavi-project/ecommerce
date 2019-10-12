<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

use Similik\Module\Order\Middleware\Update\Payment\Payoffline\AddActivityMiddleware;
use Similik\Module\Order\Middleware\Update\Payment\Payoffline\AddTransactionMiddleware;
use Similik\Module\Order\Middleware\Update\Payment\Payoffline\PayMiddleware;

$router->addAdminRoute('customer.grid', 'GET', '/customers', [
    \Similik\Module\Customer\Middleware\Grid\ColumnMiddleware::class,
    \Similik\Module\Customer\Middleware\Grid\BuildCollectionMiddleware::class,
    \Similik\Module\Customer\Middleware\Grid\GridMiddleware::class,
]);

$router->addAdminRoute('customer.edit', 'GET', '/customer/edit/{id:\d+}', [
    \Similik\Module\Customer\Middleware\Edit\CustomerInfoMiddleware::class,
]);

$router->addAdminRoute('customer.admin.create', 'POST', '/customer/save[/{id:\d+}]', [
    \Similik\Module\Customer\Middleware\Create\CreateAccountMiddleware::class,
    \Similik\Module\Customer\Middleware\Create\RedirectMiddleware::class,
]);

////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////

$router->addSiteRoute('customer.register', 'GET', '/customer/register', [
    \Similik\Module\Customer\Middleware\Register\FormMiddleware::class,
]);

$router->addSiteRoute('customer.login', 'GET', '/customer/login', [
    \Similik\Module\Customer\Middleware\Login\FormMiddleware::class,
]);

$router->addSiteRoute('customer.dashboard', 'GET', '/customer/dashboard', [
    \Similik\Module\Customer\Middleware\Dashboard\InfoMiddleware::class,
    \Similik\Module\Customer\Middleware\Dashboard\AddressMiddleware::class,
    \Similik\Module\Customer\Middleware\Dashboard\OrderMiddleware::class,
]);

$router->addSiteRoute('customer.auth', 'POST', '/customer/auth', [
    \Similik\Module\Customer\Middleware\Auth\AuthMiddleware::class,
]);

$router->addSiteRoute('customer.create', 'POST', '/customer/create', [
    \Similik\Module\Customer\Middleware\Create\CreateAccountMiddleware::class,
    \Similik\Module\Customer\Middleware\Create\RedirectMiddleware::class,
]);

$router->addSiteRoute('customer.update', 'POST', '/customer/update', [
    \Similik\Module\Customer\Middleware\Update\UpdateAccountMiddleware::class,
]);

$router->addSiteRoute('customer.logout', 'GET', '/customer/logout', [
    \Similik\Module\Customer\Middleware\Logout\LogoutMiddleware::class,
]);
