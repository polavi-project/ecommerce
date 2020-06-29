<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */

$container[\Similik\Module\Catalog\Services\Type\Price::class] =  function() {
    return new \Similik\Module\Catalog\Services\Type\Price();
};

$container[\Similik\Module\Catalog\Services\Type\ProductTierPriceType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\ProductTierPriceType($container);
};

$container[\Similik\Module\Catalog\Services\Type\CategoryType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\CategoryType($container);
};

$container[\Similik\Module\Catalog\Services\Type\ProductType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\ProductType($container);
};

$container[\Similik\Module\Catalog\Services\Type\ProductImageType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\ProductImageType($container);
};

$container[\Similik\Module\Catalog\Services\DataLoader::class] =  function() {
    return new \Similik\Module\Catalog\Services\DataLoader();
};

$container[\Similik\Module\Catalog\Services\Type\AttributeGroupType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\AttributeGroupType($container);
};

$container[\Similik\Module\Catalog\Services\Type\AttributeType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\AttributeType($container);
};

$container[\Similik\Module\Catalog\Services\Type\AttributeOptionType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\AttributeOptionType($container);
};

$container[\Similik\Module\Catalog\Services\Type\AttributeCollectionType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\AttributeCollectionType($container);
};

$container[\Similik\Module\Catalog\Services\AttributeCollection::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\AttributeCollection($container);
};

$container[\Similik\Module\Catalog\Services\Type\AttributeGroupCollectionType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\AttributeGroupCollectionType($container);
};

$container[\Similik\Module\Catalog\Services\AttributeGroupCollection::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\AttributeGroupCollection($container);
};

$container[\Similik\Module\Catalog\Services\Type\ProductAttributeIndex::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\ProductAttributeIndex($container);
};

$container[\Similik\Module\Catalog\Services\Type\CustomOptionType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\CustomOptionType($container);
};

$container[\Similik\Module\Catalog\Services\Type\CustomOptionValueType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\CustomOptionValueType($container);
};

$container[\Similik\Module\Catalog\Services\ProductMutator::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\ProductMutator();
};

$container[\Similik\Module\Catalog\Services\Type\ProductCollectionType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\ProductCollectionType($container);
};

$container[\Similik\Module\Catalog\Services\ProductCollection::class] = $container->factory(function() use ($container) {
    return new \Similik\Module\Catalog\Services\ProductCollection($container);
});

$container[\Similik\Module\Catalog\Services\Type\CategoryCollectionType::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\CategoryCollectionType($container);
};

$container[\Similik\Module\Catalog\Services\CategoryCollection::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\CategoryCollection($container);
};

$container[\Similik\Module\Catalog\Services\CategoryMutator::class] =  function() use ($container) {
    return new \Similik\Module\Catalog\Services\CategoryMutator($container[\Similik\Services\Db\Processor::class]);
};

// Filter Tool

$container[\Similik\Module\Catalog\Services\Type\ProductFilterToolType::class] = function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\ProductFilterToolType($container);
};

$container[\Similik\Module\Catalog\Services\Type\FilterTool\PriceFilterType::class] = function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\FilterTool\PriceFilterType($container);
};

$container[\Similik\Module\Catalog\Services\Type\FilterTool\CategoryFilterType::class] = function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\FilterTool\CategoryFilterType($container);
};

$container[\Similik\Module\Catalog\Services\Type\FilterTool\AttributeFilterType::class] = function() use ($container) {
    return new \Similik\Module\Catalog\Services\Type\FilterTool\AttributeFilterType($container);
};