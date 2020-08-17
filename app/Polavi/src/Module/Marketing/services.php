<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */


$container[\Polavi\Module\Marketing\Services\Type\SubscriberType::class] = function () use ($container){
    return new \Polavi\Module\Marketing\Services\Type\SubscriberType($container);
};

$container[\Polavi\Module\Marketing\Services\SubscriberCollection::class] = function () use ($container){
    return new \Polavi\Module\Marketing\Services\SubscriberCollection($container);
};

$container[\Polavi\Module\Marketing\Services\Type\SubscriberCollectionType::class] = function () use ($container){
    return new \Polavi\Module\Marketing\Services\Type\SubscriberCollectionType($container);
};
