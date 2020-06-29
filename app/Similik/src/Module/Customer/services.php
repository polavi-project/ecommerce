<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */


$container[\Similik\Module\Customer\Services\Type\CustomerType::class] = function() use ($container){
    return new \Similik\Module\Customer\Services\Type\CustomerType($container);
};

$container[\Similik\Module\Customer\Services\Type\CustomerInputType::class] = function() use ($container){
    return new \Similik\Module\Customer\Services\Type\CustomerInputType($container);
};

$container[\Similik\Module\Customer\Services\Type\CustomerGroupType::class] = function() use ($container){
    return new \Similik\Module\Customer\Services\Type\CustomerGroupType($container);
};

$container[\Similik\Module\Customer\Services\Type\AddressType::class] = function() use ($container){
    return new \Similik\Module\Customer\Services\Type\AddressType($container);
};

$container[\Similik\Module\Customer\Services\Type\AddressInputType::class] = function() use ($container){
    return new \Similik\Module\Customer\Services\Type\AddressInputType($container);
};

$container[\Similik\Module\Customer\Services\CustomerCollection::class] = function() use ($container){
    return new \Similik\Module\Customer\Services\CustomerCollection($container);
};

$container[\Similik\Module\Customer\Services\Type\CustomerCollectionType::class] = function() use ($container){
    return new \Similik\Module\Customer\Services\Type\CustomerCollectionType($container);
};
