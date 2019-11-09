<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);
/** @var \Similik\Services\Routing\Router $router */

$router->addSiteRoute('similik.install.form', 'GET', '/install', [
    \Similik\Module\Install\Middleware\Form\InitMiddleware::class,
    \Similik\Module\Install\Middleware\Form\FormMiddleware::class,
]);

$router->addSiteRoute('similik.install.post', 'GET', '/install/post', [
    \Similik\Module\User\Middleware\Login\ValidateMiddleware::class
]);