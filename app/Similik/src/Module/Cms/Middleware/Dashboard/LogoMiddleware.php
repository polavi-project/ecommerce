<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Dashboard;


use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class LogoMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('admin_logo') || !$request->isAdmin())
            return $delegate;

        $response->addWidget(
            'admin_logo',
            'header',
            10,
            get_js_file_url("production/cms/dashboard/logo.js", true),
            [
                "adminUrl" => generate_url('dashboard'),
                "logoUrl" => \Similik\get_base_url_scheme_less() . '/public/theme/admin/default/image/logo.png',
                "storeName" => get_config('general_store_name', 'Similik store admin'),
                "logoWidth" => 50
            ]
        );

        return $delegate;
    }
}