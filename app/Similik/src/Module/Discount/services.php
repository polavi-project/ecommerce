<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */
$container->set(\Similik\Module\Discount\Services\CouponHelper::class, function() use ($container) {
    return new \Similik\Module\Discount\Services\CouponHelper();
});

$container->set(\Similik\Module\Discount\Services\Type\CouponType::class, function() use ($container) {
    return new \Similik\Module\Discount\Services\Type\CouponType($container);
});

$container->set(\Similik\Module\Discount\Services\Type\CouponCollectionType::class, function() use ($container) {
    return new \Similik\Module\Discount\Services\Type\CouponCollectionType($container);
});

$container->set(\Similik\Module\Discount\Services\Type\CouponCollectionFilterType::class, function() use ($container) {
    return new \Similik\Module\Discount\Services\Type\CouponCollectionFilterType($container);
});

$container->set(\Similik\Module\Discount\Services\CouponCollection::class, function() use ($container) {
    return new \Similik\Module\Discount\Services\CouponCollection($container);
});

