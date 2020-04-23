<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */


$container[\Similik\Module\Tax\Services\Type\TaxClassType::class] = function() use ($container){
    return new \Similik\Module\Tax\Services\Type\TaxClassType($container);
};

$container[\Similik\Module\Tax\Services\Type\TaxRateType::class] = function() use ($container){
    return new \Similik\Module\Tax\Services\Type\TaxRateType($container);
};


