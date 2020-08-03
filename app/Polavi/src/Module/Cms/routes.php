<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */
$router->addAdminRoute('dashboard', 'GET', '/', [
    \Polavi\Module\Cms\Middleware\Dashboard\TitleMiddleware::class,
    \Polavi\Module\Cms\Middleware\Dashboard\LayoutMiddleware::class
]);

$router->addAdminRoute('page.grid', 'GET', '/pages', [
    \Polavi\Module\Cms\Middleware\Page\Grid\AddNewButtonMiddleware::class,
    \Polavi\Module\Cms\Middleware\Page\Grid\GridMiddleware::class
]);

$router->addAdminRoute('page.create', 'GET', '/page/create', [
    \Polavi\Module\Cms\Middleware\Page\Edit\InitMiddleware::class,
    \Polavi\Module\Cms\Middleware\Page\Edit\FormMiddleware::class
]);

$router->addAdminRoute('page.edit', 'GET', '/page/edit/{id:\d+}', [
    \Polavi\Module\Cms\Middleware\Page\Edit\InitMiddleware::class,
    \Polavi\Module\Cms\Middleware\Page\Edit\FormMiddleware::class
]);

$router->addAdminRoute('page.delete', 'GET', '/page/delete/{id:\d+}', [
    \Polavi\Module\Cms\Middleware\Page\Delete\DeleteMiddleware::class,
]);

$router->addAdminRoute('page.save', 'POST', '/page/save[/{id:\d+}]', [
    \Polavi\Module\Cms\Middleware\Page\Edit\InitMiddleware::class,
    \Polavi\Module\Cms\Middleware\Page\Edit\FormMiddleware::class
]);

$router->addAdminRoute('widget.grid', 'GET', '/widgets', [
    \Polavi\Module\Cms\Middleware\Widget\Grid\GridMiddleware::class,
    \Polavi\Module\Cms\Middleware\Widget\Grid\AddNewButtonMiddleware::class
]);

$router->addAdminRoute('widget.create', 'GET', '/widget/create', [
    \Polavi\Module\Cms\Middleware\Widget\Edit\EditMiddleware::class,
    \Polavi\Module\Cms\Middleware\Widget\Edit\GetLayoutsMiddleware::class
]);

$router->addAdminRoute('widget.edit', 'GET', '/widget/edit/{type}/{id:\d+}', [
    \Polavi\Module\Cms\Middleware\Widget\Edit\EditMiddleware::class,
    \Polavi\Module\Cms\Middleware\Widget\Edit\GetLayoutsMiddleware::class
]);

$router->addAdminRoute('widget.delete', 'GET', '/widget/edit/{id:\d+}', [
    \Polavi\Module\Cms\Middleware\Widget\Delete\DeleteMiddleware::class
]);

$router->addAdminRoute('cms.install', ["POST", "GET"], '/cms/migrate/install', [
    \Polavi\Module\Cms\Middleware\Migrate\Install\InstallMiddleware::class
]);

////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////

$pageViewMiddleware = [
    \Polavi\Module\Cms\Middleware\Page\View\ViewMiddleware::class
];
$router->addSiteRoute('page.view', 'GET', '/page/id/{id:\d+}', $pageViewMiddleware);

// Pretty url
$router->addSiteRoute('page.view.pretty', 'GET', '/page/{slug}', $pageViewMiddleware);

$router->addSiteRoute('homepage', 'GET', '/', [
    \Polavi\Module\Cms\Middleware\Page\View\HomepageMiddleware::class
]);