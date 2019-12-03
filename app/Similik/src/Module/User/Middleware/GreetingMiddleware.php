<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware;


use function Similik\_mysql;
use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

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
            ]
        );

        return $delegate;
    }
}