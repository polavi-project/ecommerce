<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */

$container[\Similik\Module\Order\Services\Type\OrderType::class] = function() use ($container){
    return new \Similik\Module\Order\Services\Type\OrderType($container);
};

$container[\Similik\Module\Order\Services\Type\OrderItemType::class] = function() use ($container){
    return new \Similik\Module\Order\Services\Type\OrderItemType($container);
};

$container[\Similik\Module\Order\Services\Type\PaymentTransactionType::class] = function() use ($container){
    return new \Similik\Module\Order\Services\Type\PaymentTransactionType($container);
};

$container[\Similik\Module\Order\Services\Type\OrderActivityType::class] = function() use ($container){
    return new \Similik\Module\Order\Services\Type\OrderActivityType($container);
};

$container[\Similik\Module\Order\Services\Type\OrderCollectionFilterType::class] = function() use ($container){
    return new \Similik\Module\Order\Services\Type\OrderCollectionFilterType($container);
};

$container[\Similik\Module\Order\Services\Type\OrderCollectionType::class] = function() use ($container){
    return new \Similik\Module\Order\Services\Type\OrderCollectionType($container);
};

$container[\Similik\Module\Order\Services\OrderCollection::class] = function() use ($container){
    return new \Similik\Module\Order\Services\OrderCollection($container);
};

