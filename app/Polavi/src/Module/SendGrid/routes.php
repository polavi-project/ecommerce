<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */


declare(strict_types=1);

/** @var \Polavi\Services\Routing\Router $router */

$router->addAdminRoute('setting.sendgrid', ["POST", "GET"], '/setting/sendgrid', [
    \Polavi\Module\SendGrid\Middleware\Setting\FormMiddleware::class,
    \Polavi\Module\SendGrid\Middleware\Setting\SaveMiddleware::class
]);
