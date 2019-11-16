<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */


declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */

$router->addAdminRoute('coupon.list', 'GET', '/coupons', [
    \Similik\Module\Discount\Middleware\Grid\GridMiddleware::class,
    \Similik\Module\Discount\Middleware\Grid\AddNewButtonMiddleware::class,
]);

$router->addAdminRoute('coupon.create', 'GET', '/coupon/create', [
    \Similik\Module\Discount\Middleware\Edit\FormMiddleware::class
]);

$router->addAdminRoute('coupon.edit', 'GET', '/coupon/edit/{id:\d+}', [
    \Similik\Module\Discount\Middleware\Edit\FormMiddleware::class
]);

$router->addAdminRoute('coupon.save', "POST", '/coupon/save[/{id:\d+}]', [
    \Similik\Module\Discount\Middleware\Save\SaveMiddleware::class
]);

$router->addAdminRoute('discount.install', ["POST", "GET"], '/discount/migrate/install', [
    \Similik\Module\Discount\Middleware\Migrate\Install\InstallMiddleware::class
]);