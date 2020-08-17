<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Event\EventDispatcher $eventDispatcher */

$eventDispatcher->addListener('register.setting.general.middleware', function (\Polavi\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareBefore(\Polavi\Module\Setting\Middleware\General\FormMiddleware::class, \Polavi\Module\GoogleAnalytics\Middleware\Setting\FormMiddleware::class);
});

$eventDispatcher->addListener('register.core.middleware', function (\Polavi\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareBefore(\Polavi\Middleware\ResponseMiddleware::class, \Polavi\Module\GoogleAnalytics\Middleware\GoogleAnalyticsTrackingMiddleware::class);
});
