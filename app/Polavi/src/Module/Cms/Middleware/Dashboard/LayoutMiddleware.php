<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Middleware\Dashboard;


use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class LayoutMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($response->hasWidget('dashboard_layout'))
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