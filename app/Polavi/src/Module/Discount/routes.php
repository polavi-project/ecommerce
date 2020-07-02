<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */


declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */

$router->addAdminRoute('coupon.grid', 'GET', '/coupons', [
    \Polavi\Module\Discount\Middleware\Grid\GridMiddleware::class,
    \Polavi\Module\Discount\Middleware\Grid\AddNewButtonMiddleware::class,
]);

$router->addAdminRoute('coupon.create', 'GET', '/coupon/create', [
    \Polavi\Module\Discount\Middleware\Edit\LoadCustomerGroupMiddleware::class,
    \Polavi\Module\Discount\Middleware\Edit\FormMiddleware::class
]);

$router->addAdminRoute('coupon.edit', 'GET', '/coupon/edit/{id:\d+}', [
    \Polavi\Module\Discount\Middleware\Edit\LoadCustomerGroupMiddleware::class,
    \Polavi\Module\Discount\Middleware\Edit\FormMiddleware::class
]);

$router->addAdminRoute('coupon.delete', 'GET', '/coupon/delete/{id:\d+}', [
    \Polavi\Module\Discount\Middleware\Delete\DeleteMiddleware::class,
]);

$router->addAdminRoute('coupon.save', "POST", '/coupon/save[/{id:\d+}]', [
    \Polavi\Module\Discount\Middleware\Save\SaveMiddleware::class
]);

$router->addAdminRoute('discount.install', ["POST", "GET"], '/discount/migrate/install', [
    \Polavi\Module\Discount\Middleware\Migrate\Install\InstallMiddleware::class
]);

$router->addSiteRoute('coupon.add', 'POST', '/cart/coupon/add', [
    \Polavi\Module\Discount\Middleware\Cart\AddCouponMiddleware::class
]);