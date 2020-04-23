<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */
$container[\Similik\Module\Checkout\Services\Cart\Cart::class] =  function() use ($container) {
    return new \Similik\Module\Checkout\Services\Cart\Cart($container->get(\Similik\Services\Http\Request::class));
};

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

$container[\Similik\Module\Checkout\Services\Type\ItemCustomOptionValueType::class] =  function() use ($container) {
    return new \Similik\Module\Checkout\Services\Type\ItemCustomOptionValueType($container);
};