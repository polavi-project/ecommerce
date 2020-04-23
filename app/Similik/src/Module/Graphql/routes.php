<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Routing\Router $router */
$router->addSiteRoute('graphql.api', ['GET', 'POST'], '/api/graphql', [
    \Similik\Module\Graphql\Middleware\Graphql\GraphqlQLMiddleware::class,
]);

$router->addAdminRoute('admin.graphql.api', ['GET', 'POST'], '/api/graphql', [
    \Similik\Module\Graphql\Middleware\Graphql\GraphqlQLMiddleware::class
]);