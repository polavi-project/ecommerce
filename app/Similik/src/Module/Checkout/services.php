<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */

$container->set(\Similik\Module\Checkout\Services\Cart\ItemFactory::class, function() use ($container) {
    return new \Similik\Module\Checkout\Services\Cart\ItemFactory($container->get(\Similik\Services\Db\Processor::class));
});


$container->set(\Similik\Module\Checkout\Services\PriceHelper::class, function() use ($container) {
    return new \Similik\Module\Checkout\Services\PriceHelper($container->get(\Similik\Services\Db\Processor::class));
});

$container[\Similik\Module\Checkout\Services\Type\CartType::class] =  function() use ($container) {
    return new \Similik\Module\Checkout\Services\Type\CartType($container);
};

$container[\Similik\Module\Checkout\Services\Type\CartItemType::class] =  function() use ($container) {
    return new \Similik\Module\Checkout\Services\Type\CartItemType($container);
};

$container[\Similik\Module\Checkout\Services\Type\ItemCustomOptionType::class] =  function() use ($container) {
    return new \Similik\Module\Checkout\Services\Type\ItemCustomOptionType($container);
};