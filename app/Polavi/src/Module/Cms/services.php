<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */


$container[\Polavi\Module\Cms\Services\Type\FileType::class] =  function() use ($container) {
    return new \Polavi\Module\Cms\Services\Type\FileType($container);
};

$container[\Polavi\Module\Cms\Services\Type\CmsPageType::class] =  function() use ($container) {
    return new \Polavi\Module\Cms\Services\Type\CmsPageType($container);
};

$container[\Polavi\Module\Cms\Services\Type\PageCollectionType::class] = function() use ($container){
    return new \Polavi\Module\Cms\Services\Type\PageCollectionType($container);
};

$container[\Polavi\Module\Cms\Services\Type\CmsPageInputType::class] = function() use ($container){
    return new \Polavi\Module\Cms\Services\Type\CmsPageInputType($container);
};

$container[\Polavi\Module\Cms\Services\Type\WidgetType::class] =  function() use ($container) {
    return new \Polavi\Module\Cms\Services\Type\WidgetType($container);
};

$container[\Polavi\Module\Cms\Services\Type\WidgetCollectionType::class] = function() use ($container){
    return new \Polavi\Module\Cms\Services\Type\WidgetCollectionType($container);
};

$container[\Polavi\Module\Cms\Services\Type\WidgetInputType::class] = function() use ($container){
    return new \Polavi\Module\Cms\Services\Type\WidgetInputType($container);
};