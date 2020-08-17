<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */


$container[\Polavi\Module\Customer\Services\Type\CustomerType::class] = function () use ($container){
    return new \Polavi\Module\Customer\Services\Type\CustomerType($container);
};

$container[\Polavi\Module\Customer\Services\Type\CustomerInputType::class] = function () use ($container){
    return new \Polavi\Module\Customer\Services\Type\CustomerInputType($container);
};

$container[\Polavi\Module\Customer\Services\Type\CustomerGroupType::class] = function () use ($container){
    return new \Polavi\Module\Customer\Services\Type\CustomerGroupType($container);
};

$container[\Polavi\Module\Customer\Services\Type\AddressType::class] = function () use ($container){
    return new \Polavi\Module\Customer\Services\Type\AddressType($container);
};

$container[\Polavi\Module\Customer\Services\Type\AddressInputType::class] = function () use ($container){
    return new \Polavi\Module\Customer\Services\Type\AddressInputType($container);
};

$container[\Polavi\Module\Customer\Services\CustomerCollection::class] = function () use ($container){
    return new \Polavi\Module\Customer\Services\CustomerCollection($container);
};

$container[\Polavi\Module\Customer\Services\Type\CustomerCollectionType::class] = function () use ($container){
    return new \Polavi\Module\Customer\Services\Type\CustomerCollectionType($container);
};
