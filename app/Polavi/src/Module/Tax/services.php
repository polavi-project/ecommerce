<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */


$container[\Polavi\Module\Tax\Services\Type\TaxClassType::class] = function () use ($container){
    return new \Polavi\Module\Tax\Services\Type\TaxClassType($container);
};

$container[\Polavi\Module\Tax\Services\Type\TaxRateType::class] = function () use ($container){
    return new \Polavi\Module\Tax\Services\Type\TaxRateType($container);
};


