<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Event\EventDispatcher $eventDispatcher */

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddleware(\Polavi\Module\Graphql\Middleware\Graphql\AddApiUrlStateMiddleware::class, 51);
    },
    0
);

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Polavi\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddlewareBefore(\Polavi\Middleware\PromiseWaiterMiddleware::class, \Polavi\Module\Graphql\Middleware\Graphql\AddServerExecutorPromiseMiddleware::class);
    },
    0
);