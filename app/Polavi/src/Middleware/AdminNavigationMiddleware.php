<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;


use function Polavi\create_mutable_var;
use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_js_file_url;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AdminNavigationMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if (!$request->isAdmin() || $request->attributes->get('_matched_route') == 'admin.login') {
            return $delegate;
        }

        $response->addWidget(
            'admin_navigation',
            'menu',
            0,
            get_js_file_url("production/cms/dashboard/navigation.js", true),
            [
                "adminUrl" => generate_url('dashboard'),
                "logoUrl" => \Polavi\get_base_url_scheme_less() . '/public/theme/admin/default/image/logo.png',
                "storeName" => get_config('general_store_name', 'Polavi store admin'),
                "items"=> create_mutable_var("admin_menu", [
                    [
                        "id" => "quick_links",
                        "sort_order" => 0,
                        "url" => null,
                        "title" => "Quick links",
                        "parent_id" => null
                    ],
                    [
                        "id" => "dashboard",
                        "sort_order" => 5,
                        "url" => generate_url("dashboard"),
                        "title" => "Dashboard",
                        "icon" => "home",
                        "parent_id" => "quick_links"
                    ]
                ])
            ]
        );

        return $delegate;
    }
}