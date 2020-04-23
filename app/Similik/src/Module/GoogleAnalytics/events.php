<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

$eventDispatcher->addListener('register.setting.general.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareBefore(\Similik\Module\Setting\Middleware\General\FormMiddleware::class, \Similik\Module\GoogleAnalytics\Middleware\Setting\FormMiddleware::class);
});

$eventDispatcher->addListener('register.core.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddlewareBefore(\Similik\Middleware\ResponseMiddleware::class, \Similik\Module\GoogleAnalytics\Middleware\GoogleAnalyticsTrackingMiddleware::class);
});
