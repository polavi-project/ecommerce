<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */
$router->addAdminRoute('product.grid', 'GET', '/products', [
    \Polavi\Module\Catalog\Middleware\Product\Grid\GridMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Grid\AddNewButtonMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Grid\ActionColumn::class,
]);

$productEditMiddleware = [
    \Polavi\Module\Catalog\Middleware\Product\Edit\InitMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\FormMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\GeneralInfoMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\InventoryMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\ImagesMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\SeoMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\VariantMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\PriceMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\CategoryMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\AttributeMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Edit\CustomOptionMiddleware::class,
];
$router->addAdminRoute('product.create', 'GET', '/product/create', $productEditMiddleware);

$router->addAdminRoute('product.edit', 'GET', '/product/edit/{id:\d+}', $productEditMiddleware);

$router->addAdminRoute('product.save', 'POST', '/product/save[/{id:\d+}]', [
    \Polavi\Module\Catalog\Middleware\Product\Save\ValidateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Save\UpdateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Save\CreateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\Save\SaveVariantMiddleware::class
]);

$router->addAdminRoute('product.delete', ['GET', 'POST'], '/product/delete/{id:\d+}', [
    Polavi\Module\Catalog\Middleware\Product\Delete\DeleteMiddleware::class
]);

//////////////// CATEGORY ////////////////////

$router->addAdminRoute('category.grid', 'GET', '/categories', [
    \Polavi\Module\Catalog\Middleware\Category\Grid\GridMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\Grid\AddNewButtonMiddleware::class,
]);

$categoryEditMiddleware = [
    \Polavi\Module\Catalog\Middleware\Category\Edit\InitMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\Edit\FormMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\Edit\GeneralInfoMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\Edit\SeoMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\Edit\ProductsMiddleware::class
];
$router->addAdminRoute('category.create', 'GET', '/category/create', $categoryEditMiddleware);

$router->addAdminRoute('category.edit', 'GET', '/category/edit/{id:\d+}', $categoryEditMiddleware);

$router->addAdminRoute('category.delete', ["POST", "GET"], '/category/delete/{id:\d+}', [
    \Polavi\Module\Catalog\Middleware\Category\Delete\DeleteMiddleware::class
]);

$router->addAdminRoute('category.save', 'POST', '/category/save[/{id:\d+}]', [
    \Polavi\Module\Catalog\Middleware\Category\Save\ValidateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\Save\UpdateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\Save\CreateMiddleware::class
]);

//////////////// ATTRIBUTE ////////////////////

$router->addAdminRoute('attribute.grid', 'GET', '/attributes', [
    \Polavi\Module\Catalog\Middleware\Attribute\Grid\GridMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Attribute\Grid\AddNewButtonMiddleware::class,
]);

$attributeEditMiddleware = [
    \Polavi\Module\Catalog\Middleware\Attribute\Edit\InitMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Attribute\Edit\EditFormMiddleware::class
];
$router->addAdminRoute('attribute.create', 'GET', '/attribute/create', $attributeEditMiddleware);

$router->addAdminRoute('attribute.edit', 'GET', '/attribute/edit/{id:\d+}', $attributeEditMiddleware);

$router->addAdminRoute('attribute.delete', 'GET', '/attribute/delete/{id:\d+}', [
    \Polavi\Module\Catalog\Middleware\Attribute\Delete\DeleteMiddleware::class
]);

$router->addAdminRoute('attribute.save', 'POST', '/attribute/save[/{id:\d+}]', [
    \Polavi\Module\Catalog\Middleware\Attribute\Save\UpdateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Attribute\Save\CreateMiddleware::class
]);

//////////////// ATTRIBUTE GROUP ////////////////////

$router->addAdminRoute('attribute.group.grid', 'GET', '/attribute/groups', [
    \Polavi\Module\Catalog\Middleware\AttributeGroup\Grid\GridMiddleware::class,
    \Polavi\Module\Catalog\Middleware\AttributeGroup\Grid\AddNewButtonMiddleware::class,
]);

$attributeGroupEditMiddleware = [
    \Polavi\Module\Catalog\Middleware\AttributeGroup\Edit\InitMiddleware::class,
    \Polavi\Module\Catalog\Middleware\AttributeGroup\Edit\EditFormMiddleware::class
];
$router->addAdminRoute('attribute.group.create', 'GET', '/attribute/group/create', $attributeGroupEditMiddleware);

$router->addAdminRoute('attribute.group.edit', 'GET', '/attribute/group/edit/{id:\d+}', $attributeGroupEditMiddleware);

$router->addAdminRoute('attribute.group.delete', 'GET', '/attribute/group/delete/{id:\d+}', [
    Polavi\Module\Catalog\Middleware\AttributeGroup\Delete\DeleteMiddleware::class
]);

$router->addAdminRoute('attribute.group.save', 'POST', '/attribute/group/save[/{id:\d+}]', [
    \Polavi\Module\Catalog\Middleware\AttributeGroup\Save\UpdateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\AttributeGroup\Save\CreateMiddleware::class
]);

$router->addAdminRoute('catalog.install', 'POST', '/catalog/migrate/install', [
    \Polavi\Module\Catalog\Middleware\Migrate\Install\InstallMiddleware::class
]);

////////////////////////////////////////////
////            SITE ROUTERS           /////
////////////////////////////////////////////


$categoryViewMiddleware = [
    \Polavi\Module\Catalog\Middleware\Category\View\InitMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\View\GeneralInfoMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Widget\ProductFilter\SaveQueryToSessionMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\View\QueryValidateMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Category\View\ProductsMiddleware::class
];
$router->addSiteRoute('category.view', 'GET', '/catalog/id/{id:\d+}', $categoryViewMiddleware);

// Pretty url
$router->addSiteRoute('category.view.pretty', 'GET', '/catalog/{slug}', $categoryViewMiddleware);

$productViewMiddleware = [
    \Polavi\Module\Catalog\Middleware\Product\View\InitMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\VariantMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\VariantDetectMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\LayoutMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\PriceMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\GeneralInfoMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\ImagesMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\DescriptionMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\AttributeMiddleware::class,
    \Polavi\Module\Catalog\Middleware\Product\View\FormMiddleware::class,
];

$router->addSiteRoute('product.view', 'GET', '/product/id/{id:\d+}', $productViewMiddleware);

// Pretty url
$router->addSiteRoute('product.view.pretty', 'GET', '/product/{slug}', $productViewMiddleware);