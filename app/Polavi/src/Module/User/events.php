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
        $middlewareManager->registerMiddlewareBefore(\Polavi\Middleware\ResponseMiddleware::class, \Polavi\Module\User\Middleware\GreetingMiddleware::class);
    },
    5
);