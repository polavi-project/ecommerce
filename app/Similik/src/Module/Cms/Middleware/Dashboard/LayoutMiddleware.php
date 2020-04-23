<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Dashboard;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class LayoutMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('dashboard_layout'))
            return $delegate;

        $response->addWidget(
            'dashboard_layout',
            'content',
            10,
            get_js_file_url("production/cms/dashboard/layout.js", true)
        );

        return $delegate;
    }
}