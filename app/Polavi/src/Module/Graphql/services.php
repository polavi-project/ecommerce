<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */


$container[\Polavi\Module\Graphql\Services\QueryType::class] = function () use ($container){
    return new \Polavi\Module\Graphql\Services\QueryType($container);
};

$container[\Polavi\Module\Graphql\Services\MutationType::class] = function () use ($container){
    return new \Polavi\Module\Graphql\Services\MutationType($container);
};

$container[\GraphQL\Type\Schema::class] =  function () use ($container) {
    return new \GraphQL\Type\Schema([
        'query'=> $container->get(\Polavi\Module\Graphql\Services\QueryType::class),
        'mutation' => $container->get(\Polavi\Module\Graphql\Services\MutationType::class),
    ]);
};

$container[\Polavi\Module\Graphql\Services\GraphqlExecutor::class] =  function () use ($container) {
    return new \Polavi\Module\Graphql\Services\GraphqlExecutor($container[\GraphQL\Type\Schema::class], $container);
};

$container[\Polavi\Module\Graphql\Services\FilterFieldType::class] = function () use ($container){
    return new \Polavi\Module\Graphql\Services\FilterFieldType($container);
};

$container[\Polavi\Module\Graphql\Services\FilterOperatorType::class] = function () use ($container){
    return new \Polavi\Module\Graphql\Services\FilterOperatorType();
};

$container[\Polavi\Module\Graphql\Services\KeyValuePairFieldTypeInput::class] = function () use ($container){
    return new \Polavi\Module\Graphql\Services\KeyValuePairFieldTypeInput($container);
};

$container[\Polavi\Module\Graphql\Services\KeyValuePairFieldType::class] = function () use ($container){
    return new \Polavi\Module\Graphql\Services\KeyValuePairFieldType($container);
};