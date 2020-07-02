<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */

$container[\Polavi\Module\Catalog\Services\Type\Price::class] =  function() {
    return new \Polavi\Module\Catalog\Services\Type\Price();
};

$container[\Polavi\Module\Catalog\Services\Type\ProductTierPriceType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\ProductTierPriceType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\CategoryType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\CategoryType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\ProductType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\ProductType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\ProductImageType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\ProductImageType($container);
};

$container[\Polavi\Module\Catalog\Services\DataLoader::class] =  function() {
    return new \Polavi\Module\Catalog\Services\DataLoader();
};

$container[\Polavi\Module\Catalog\Services\Type\AttributeGroupType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\AttributeGroupType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\AttributeType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\AttributeType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\AttributeOptionType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\AttributeOptionType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\AttributeCollectionType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\AttributeCollectionType($container);
};

$container[\Polavi\Module\Catalog\Services\AttributeCollection::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\AttributeCollection($container);
};

$container[\Polavi\Module\Catalog\Services\Type\AttributeGroupCollectionType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\AttributeGroupCollectionType($container);
};

$container[\Polavi\Module\Catalog\Services\AttributeGroupCollection::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\AttributeGroupCollection($container);
};

$container[\Polavi\Module\Catalog\Services\Type\ProductAttributeIndex::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\ProductAttributeIndex($container);
};

$container[\Polavi\Module\Catalog\Services\Type\CustomOptionType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\CustomOptionType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\CustomOptionValueType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\CustomOptionValueType($container);
};

$container[\Polavi\Module\Catalog\Services\ProductMutator::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\ProductMutator();
};

$container[\Polavi\Module\Catalog\Services\Type\ProductCollectionType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\ProductCollectionType($container);
};

$container[\Polavi\Module\Catalog\Services\ProductCollection::class] = $container->factory(function() use ($container) {
    return new \Polavi\Module\Catalog\Services\ProductCollection($container);
});

$container[\Polavi\Module\Catalog\Services\Type\CategoryCollectionType::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\CategoryCollectionType($container);
};

$container[\Polavi\Module\Catalog\Services\CategoryCollection::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\CategoryCollection($container);
};

$container[\Polavi\Module\Catalog\Services\CategoryMutator::class] =  function() use ($container) {
    return new \Polavi\Module\Catalog\Services\CategoryMutator($container[\Polavi\Services\Db\Processor::class]);
};

// Filter Tool

$container[\Polavi\Module\Catalog\Services\Type\ProductFilterToolType::class] = function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\ProductFilterToolType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\FilterTool\PriceFilterType::class] = function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\FilterTool\PriceFilterType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\FilterTool\CategoryFilterType::class] = function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\FilterTool\CategoryFilterType($container);
};

$container[\Polavi\Module\Catalog\Services\Type\FilterTool\AttributeFilterType::class] = function() use ($container) {
    return new \Polavi\Module\Catalog\Services\Type\FilterTool\AttributeFilterType($container);
};