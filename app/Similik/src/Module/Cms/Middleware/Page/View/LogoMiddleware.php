<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Page\View;

use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;

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
            'header',
            10,
            get_js_file_url("production/cms/page/logo.js", false),
            [
                "homeUrl" => generate_url('homepage'),
                "logoUrl" => get_config('general_logo') ? \Similik\get_base_url_scheme_less() . '/public/media/' . get_config('general_logo') : null,
                "storeName" => get_config('general_store_name'),
                "logoWidth" => get_config('general_logo_width', 50),
                "logoHeight" => get_config('general_logo_height', 50)
            ]
        );

        return $delegate;
    }
}