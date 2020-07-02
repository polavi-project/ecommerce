<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */
$container->set(\Polavi\Module\Discount\Services\CouponHelper::class, function() use ($container) {
    return new \Polavi\Module\Discount\Services\CouponHelper($container->get(\Polavi\Module\Checkout\Services\Cart\Cart::class));
});

$container->set(\Polavi\Module\Discount\Services\Type\CouponType::class, function() use ($container) {
    return new \Polavi\Module\Discount\Services\Type\CouponType($container);
});

$container->set(\Polavi\Module\Discount\Services\Type\CouponCollectionType::class, function() use ($container) {
    return new \Polavi\Module\Discount\Services\Type\CouponCollectionType($container);
});

$container->set(\Polavi\Module\Discount\Services\Type\CouponCollectionFilterType::class, function() use ($container) {
    return new \Polavi\Module\Discount\Services\Type\CouponCollectionFilterType($container);
});

$container->set(\Polavi\Module\Discount\Services\CouponCollection::class, function() use ($container) {
    return new \Polavi\Module\Discount\Services\CouponCollection($container);
});

