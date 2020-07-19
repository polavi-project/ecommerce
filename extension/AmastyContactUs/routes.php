<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Routing\Router $router*/

$router->addSiteRoute('contact.us', "GET", '/contact', [
    \AmastyContactUs\Middleware\FormMiddleware::class
]);