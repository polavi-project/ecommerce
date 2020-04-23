<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;


use function Similik\create_mutable_var;
use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class AdminNavigationMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$request->isAdmin() || $request->attributes->get('_matched_route') == 'admin.login')
            return $delegate;

        $response->addWidget(
            'admin_navigation',
            'menu',
            0,
            get_js_file_url("production/cms/dashboard/navigation.js", true),
            [
                "adminUrl" => generate_url('dashboard'),
                "logoUrl" => \Similik\get_base_url_scheme_less() . '/public/theme/admin/default/image/logo.png',
                "storeName" => get_config('general_store_name', 'Similik store admin'),
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