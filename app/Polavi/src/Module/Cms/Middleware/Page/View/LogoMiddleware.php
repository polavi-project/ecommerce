<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Middleware\Page\View;

use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_js_file_url;
use Polavi\Services\Http\Response;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;

class LogoMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('site_logo') || $request->isAdmin())
            return $delegate;

        $response->addWidget(
            'site_logo',
            'header_center',
            10,
            get_js_file_url("production/cms/page/logo.js", false),
            [
                "homeUrl" => generate_url('homepage'),
                "logoUrl" => get_config('general_logo') ? \Polavi\get_base_url_scheme_less() . '/public/media/' . get_config('general_logo') : null,
                "storeName" => get_config('general_store_name'),
                "logoWidth" => get_config('general_logo_width', 50),
                "logoHeight" => get_config('general_logo_height', 50)
            ]
        );

        return $delegate;
    }
}