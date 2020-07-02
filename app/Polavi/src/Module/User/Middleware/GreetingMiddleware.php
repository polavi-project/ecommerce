<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\User\Middleware;


use function Polavi\_mysql;
use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class GreetingMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(
            $response->hasWidget('admin_user_greeting') ||
            !$request->isAdmin() ||
            $request->attributes->get('_matched_route') == 'admin.login' ||
            $request->attributes->get('_matched_route') == 'admin.authenticate'
        )
            return $delegate;

        $user = _mysql()->getTable('admin_user')->load($request->getSession()->get('user_id'));
        $response->addWidget(
            'admin_user_greeting',
            'header',
            20,
            get_js_file_url("production/user/greeting.js", true),
            [
                "fullName" => $user['full_name'],
                "logoutUrl" => generate_url('admin.logout'),
                "time" => date("F j, Y, g:i a"),
            ]
        );

        return $delegate;
    }
}