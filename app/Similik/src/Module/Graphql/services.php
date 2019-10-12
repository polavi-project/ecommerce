<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */


$container[\Similik\Module\Graphql\Services\QueryType::class] = function() use ($container){
    return new \Similik\Module\Graphql\Services\QueryType($container);
};

$container[\Similik\Module\Graphql\Services\MutationType::class] = function() use ($container){
    return new \Similik\Module\Graphql\Services\MutationType($container);
};

$container[\GraphQL\Type\Schema::class] =  function() use ($container) {
    return new \GraphQL\Type\Schema([
        'query'=> $container->get(\Similik\Module\Graphql\Services\QueryType::class),
        'mutation' => $container->get(\Similik\Module\Graphql\Services\MutationType::class),
    ]);
};

$container[\Similik\Module\Graphql\Services\GraphqlExecutor::class] =  function() use ($container) {
    return new \Similik\Module\Graphql\Services\GraphqlExecutor($container[\GraphQL\Type\Schema::class], $container);
};

$container[\Overblog\DataLoader\Promise\Adapter\Webonyx\GraphQL\SyncPromiseAdapter::class] = $container->factory(function ($c) {
    return new \Overblog\DataLoader\Promise\Adapter\Webonyx\GraphQL\SyncPromiseAdapter();
});

$container[\Overblog\PromiseAdapter\Adapter\WebonyxGraphQLSyncPromiseAdapter::class] = $container->factory(function ($c) {
    return new \Overblog\PromiseAdapter\Adapter\WebonyxGraphQLSyncPromiseAdapter(
        $c[\Overblog\DataLoader\Promise\Adapter\Webonyx\GraphQL\SyncPromiseAdapter::class]
    );
});

$container[\Similik\Module\Graphql\Services\FilterFieldType::class] = function() use ($container){
    return new \Similik\Module\Graphql\Services\FilterFieldType($container);
};

$container[\Similik\Module\Graphql\Services\FilterOperatorType::class] = function() use ($container){
    return new \Similik\Module\Graphql\Services\FilterOperatorType();
};

$container[\Similik\Module\Graphql\Services\KeyValuePairFieldTypeInput::class] = function() use ($container){
    return new \Similik\Module\Graphql\Services\KeyValuePairFieldTypeInput($container);
};

$container[\Similik\Module\Graphql\Services\KeyValuePairFieldType::class] = function() use ($container){
    return new \Similik\Module\Graphql\Services\KeyValuePairFieldType($container);
};