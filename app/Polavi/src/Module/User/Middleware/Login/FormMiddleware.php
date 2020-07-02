<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\User\Middleware\Login;

use function Polavi\get_js_file_url;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

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
                "action"=> $this->getContainer()->get(Router::class)->generateUrl("admin.authenticate"),
                "logoUrl" => \Polavi\get_base_url_scheme_less() . '/public/theme/admin/default/image/logo.png',
            ]
        );
        
        return $delegate;
    }
}