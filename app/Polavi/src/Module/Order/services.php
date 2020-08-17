<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */

$container[\Polavi\Module\Order\Services\Type\OrderType::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\Type\OrderType($container);
};

$container[\Polavi\Module\Order\Services\Type\OrderItemType::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\Type\OrderItemType($container);
};

$container[\Polavi\Module\Order\Services\Type\PaymentTransactionType::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\Type\PaymentTransactionType($container);
};

$container[\Polavi\Module\Order\Services\Type\OrderActivityType::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\Type\OrderActivityType($container);
};

$container[\Polavi\Module\Order\Services\Type\OrderCollectionFilterType::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\Type\OrderCollectionFilterType($container);
};

$container[\Polavi\Module\Order\Services\Type\OrderCollectionType::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\Type\OrderCollectionType($container);
};

$container[\Polavi\Module\Order\Services\OrderLoader::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\OrderLoader();
};

$container[\Polavi\Module\Order\Services\OrderCollection::class] = function () use ($container){
    return new \Polavi\Module\Order\Services\OrderCollection($container);
};

