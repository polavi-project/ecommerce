<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */
$container[\Polavi\Module\Checkout\Services\Cart\Cart::class] =  function () use ($container) {
    return new \Polavi\Module\Checkout\Services\Cart\Cart($container->get(\Polavi\Services\Http\Request::class));
};

$container->set(\Polavi\Module\Checkout\Services\PriceHelper::class, function () use ($container) {
    return new \Polavi\Module\Checkout\Services\PriceHelper($container->get(\Polavi\Services\Db\Processor::class));
});

$container[\Polavi\Module\Checkout\Services\Type\CartType::class] =  function () use ($container) {
    return new \Polavi\Module\Checkout\Services\Type\CartType($container);
};

$container[\Polavi\Module\Checkout\Services\Type\CartItemType::class] =  function () use ($container) {
    return new \Polavi\Module\Checkout\Services\Type\CartItemType($container);
};

$container[\Polavi\Module\Checkout\Services\Type\ItemCustomOptionType::class] =  function () use ($container) {
    return new \Polavi\Module\Checkout\Services\Type\ItemCustomOptionType($container);
};

$container[\Polavi\Module\Checkout\Services\Type\ItemCustomOptionValueType::class] =  function () use ($container) {
    return new \Polavi\Module\Checkout\Services\Type\ItemCustomOptionValueType($container);
};

$container[\Polavi\Module\Checkout\Services\Type\ItemVariantOptionType::class] =  function () use ($container) {
    return new \Polavi\Module\Checkout\Services\Type\ItemVariantOptionType($container);
};