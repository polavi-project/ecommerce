<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware\Login;

use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'admin_login_form',
            'content',
            10,
            get_js_file_url("production/user/login/admin_login_form.js", true),
            [
                "id"=> "admin_login_form",
                "action"=> $this->getContainer()->get(Router::class)->generateUrl("admin.authenticate")
            ]
        );
        
        return $delegate;
    }
}