<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */
$router->addAdminRoute('subscriber.grid', 'GET', '/subscribers', [
    \Polavi\Module\Marketing\Middleware\Newsletter\GridMiddleware::class
]);

$router->addSiteRoute('newsletter.subscribe', 'POST', '/newsletter/subscribe', [
    \Polavi\Module\Marketing\Middleware\Newsletter\SubscribeMiddleware::class
]);

$router->addSiteRoute('newsletter.unsubscribe', 'POST', '/newsletter/unsubscribe', [
    \Polavi\Module\Marketing\Middleware\Newsletter\UnsubscribeMiddleware::class
]);

$router->addAdminRoute('admin.newsletter.unsubscribe', 'POST', '/newsletter/unsubscribe', [
    \Polavi\Module\Marketing\Middleware\Newsletter\UnsubscribeMiddleware::class
]);