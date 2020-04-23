<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

$eventDispatcher->addListener(
    'register.core.middleware',
    function (\Similik\Services\MiddlewareManager $middlewareManager) {
        $middlewareManager->registerMiddlewareBefore(\Similik\Middleware\ResponseMiddleware::class, \Similik\Module\User\Middleware\GreetingMiddleware::class);
    },
    5
);