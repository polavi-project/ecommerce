<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */


$container[\Similik\Module\Cms\Services\Type\FileType::class] =  function() use ($container) {
    return new \Similik\Module\Cms\Services\Type\FileType($container);
};

$container[\Similik\Module\Cms\Services\Type\CmsPageType::class] =  function() use ($container) {
    return new \Similik\Module\Cms\Services\Type\CmsPageType($container);
};

$container[\Similik\Module\Cms\Services\Type\PageCollectionFilterType::class] = function() use ($container){
    return new \Similik\Module\Cms\Services\Type\PageCollectionFilterType($container);
};

$container[\Similik\Module\Cms\Services\Type\PageCollectionType::class] = function() use ($container){
    return new \Similik\Module\Cms\Services\Type\PageCollectionType($container);
};

$container[\Similik\Module\Cms\Services\Type\CmsPageInputType::class] = function() use ($container){
    return new \Similik\Module\Cms\Services\Type\CmsPageInputType($container);
};

$container[\Similik\Module\Cms\Services\Type\WidgetType::class] =  function() use ($container) {
    return new \Similik\Module\Cms\Services\Type\WidgetType($container);
};

$container[\Similik\Module\Cms\Services\Type\WidgetCollectionFilterType::class] = function() use ($container){
    return new \Similik\Module\Cms\Services\Type\WidgetCollectionFilterType($container);
};

$container[\Similik\Module\Cms\Services\Type\WidgetCollectionType::class] = function() use ($container){
    return new \Similik\Module\Cms\Services\Type\WidgetCollectionType($container);
};

$container[\Similik\Module\Cms\Services\Type\WidgetInputType::class] = function() use ($container){
    return new \Similik\Module\Cms\Services\Type\WidgetInputType($container);
};