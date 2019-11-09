<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */
$router->addAdminRoute('product.grid', 'GET', '/products', [
//    \Similik\Module\Catalog\Middleware\Product\Grid\ColumnMiddleware::class,
//    \Similik\Module\Catalog\Middleware\Product\Grid\BuildCollectionMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Grid\GridMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Grid\ActionColumn::class,
]);

$productEditMiddleware = [
    \Similik\Module\Catalog\Middleware\Product\Edit\InitMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\FormMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\GeneralInfoMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\ImagesMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\SeoMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\PriceMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\CategoryMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\AttributeMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Edit\CustomOptionMiddleware::class,
];
$router->addAdminRoute('product.create', 'GET', '/product/create', $productEditMiddleware);

$router->addAdminRoute('product.edit', 'GET', '/product/edit/{id:\d+}', $productEditMiddleware);

$router->addAdminRoute('product.save', 'POST', '/product/save[/{id:\d+}]', [
    \Similik\Module\Catalog\Middleware\Product\Save\ValidateMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Save\UpdateMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\Save\CreateMiddleware::class
]);

$router->addAdminRoute('product.delete', 'GET', '/product/delete/{id:\d+}', [
//    \Similik\Module\Catalog\Middleware\Product\Save\ValidateMiddleware::class,
//    \Similik\Module\Catalog\Middleware\Product\Save\UpdateMiddleware::class,
//    \Similik\Module\Catalog\Middleware\Product\Save\CreateMiddleware::class
]);

//////////////// CATEGORY ////////////////////

$router->addAdminRoute('category.grid', 'GET', '/categories', [
    \Similik\Module\Catalog\Middleware\Category\Grid\GridMiddleware::class,
]);

$categoryEditMiddleware = [
    \Similik\Module\Catalog\Middleware\Category\Edit\InitMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\Edit\FormMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\Edit\GeneralInfoMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\Edit\SeoMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\Edit\ProductsMiddleware::class
];
$router->addAdminRoute('category.create', 'GET', '/category/create', $categoryEditMiddleware);

$router->addAdminRoute('category.edit', 'GET', '/category/edit/{id:\d+}', $categoryEditMiddleware);

$router->addAdminRoute('category.save', 'POST', '/category/save[/{id:\d+}]', [
    \Similik\Module\Catalog\Middleware\Category\Save\ValidateMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\Save\UpdateMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\Save\CreateMiddleware::class
]);

$router->addAdminRoute('category.delete', 'GET', '/category/delete/{id:\d+}', [
//    \Similik\Module\Catalog\Middleware\Category\Save\ValidateMiddleware::class,
//    \Similik\Module\Catalog\Middleware\Category\Save\UpdateMiddleware::class,
//    \Similik\Module\Catalog\Middleware\Category\Save\CreateMiddleware::class
]);

//////////////// ATTRIBUTE ////////////////////

$router->addAdminRoute('attribute.grid', 'GET', '/attributes', [
    \Similik\Module\Catalog\Middleware\Attribute\Grid\GridMiddleware::class,
    \Similik\Module\Catalog\Middleware\Attribute\Grid\AddNewButtonMiddleware::class,
]);

$attributeEditMiddleware = [
    \Similik\Module\Catalog\Middleware\Attribute\Edit\InitMiddleware::class,
    \Similik\Module\Catalog\Middleware\Attribute\Edit\EditFormMiddleware::class
];
$router->addAdminRoute('attribute.create', 'GET', '/attribute/create', $attributeEditMiddleware);

$router->addAdminRoute('attribute.edit', 'GET', '/attribute/edit/{id:\d+}', $attributeEditMiddleware);

$router->addAdminRoute('attribute.save', 'POST', '/attribute/save[/{id:\d+}]', [
    \Similik\Module\Catalog\Middleware\Attribute\Save\UpdateMiddleware::class,
    \Similik\Module\Catalog\Middleware\Attribute\Save\CreateMiddleware::class
]);

$router->addAdminRoute('attribute.delete', 'GET', '/attribute/delete/{id:\d+}', [
//    \Similik\Module\Catalog\Middleware\Category\Save\ValidateMiddleware::class,
//    \Similik\Module\Catalog\Middleware\Category\Save\UpdateMiddleware::class,
//    \Similik\Module\Catalog\Middleware\Category\Save\CreateMiddleware::class
]);

//////////////// ATTRIBUTE GROUP ////////////////////

$router->addAdminRoute('attribute.group.grid', 'GET', '/attribute/groups', [
    \Similik\Module\Catalog\Middleware\AttributeGroup\Grid\GridMiddleware::class,
    \Similik\Module\Catalog\Middleware\AttributeGroup\Grid\AddNewButtonMiddleware::class,
]);

$attributeGroupEditMiddleware = [
    \Similik\Module\Catalog\Middleware\AttributeGroup\Edit\InitMiddleware::class,
    \Similik\Module\Catalog\Middleware\AttributeGroup\Edit\EditFormMiddleware::class
];
$router->addAdminRoute('attribute.group.create', 'GET', '/attribute/group/create', $attributeGroupEditMiddleware);

$router->addAdminRoute('attribute.group.edit', 'GET', '/attribute/group/edit/{id:\d+}', $attributeGroupEditMiddleware);

$router->addAdminRoute('attribute.group.save', 'POST', '/attribute/group/save[/{id:\d+}]', [
    \Similik\Module\Catalog\Middleware\AttributeGroup\Save\UpdateMiddleware::class,
    \Similik\Module\Catalog\Middleware\AttributeGroup\Save\CreateMiddleware::class
]);

$router->addAdminRoute('catalog.install', 'POST', '/catalog/migrate/install', [
    \Similik\Module\Catalog\Middleware\Migrate\Install\InstallMiddleware::class
]);

////////////////////////////////////////////
///            SITE ROUTERS           //////
////////////////////////////////////////////


$categoryViewMiddleware = [
    \Similik\Module\Catalog\Middleware\Category\View\InitMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\View\GeneralInfoMiddleware::class,
    \Similik\Module\Catalog\Middleware\Category\View\ProductsMiddleware::class
];
$router->addSiteRoute('category.view', 'GET', '/catalog/id/{id:\d+}', $categoryViewMiddleware);

// Pretty url
$router->addSiteRoute('category.view.pretty', 'GET', '/catalog/{slug}', $categoryViewMiddleware);

$productViewMiddleware = [
    \Similik\Module\Catalog\Middleware\Product\View\InitMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\View\LayoutMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\View\PriceMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\View\GeneralInfoMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\View\ImagesMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\View\AttributeMiddleware::class,
    \Similik\Module\Catalog\Middleware\Product\View\FormMiddleware::class,
];
$router->addSiteRoute('product.view', 'GET', '/products/id/{id:\d+}', $productViewMiddleware);

// Pretty url
$router->addSiteRoute('product.view.pretty', 'GET', '/products/{slug}', $productViewMiddleware);