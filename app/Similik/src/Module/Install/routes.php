<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);
/** @var \Similik\Services\Routing\Router $router */

$router->addSiteRoute('similik.install.form', 'GET', '/install', [
    \Similik\Module\Install\Middleware\Form\FormMiddleware::class
]);

$router->addSiteRoute('similik.install.post', 'POST', '/install/post', [
    \Similik\Module\Install\Middleware\Post\CreateConfigFileMiddleware::class,
    \Similik\Module\Install\Middleware\Post\CreateAdminUserMiddleware::class
]);

$router->addAdminRoute('similik.install.finish', 'POST', '/install/finish', [
    \Similik\Module\Install\Middleware\Finish\FinishMiddleware::class
]);