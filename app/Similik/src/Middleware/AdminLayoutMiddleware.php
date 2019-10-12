<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class AdminLayoutMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$request->isAdmin())
            return $delegate;
        if(!$response->isNewPage())
            return $delegate;

        $response->addWidget(
            'admin_header',
            'container',
            0,
            get_js_file_url("production/area.js", true),
            ["id"=> "header"]
        );
        $response->addWidget(
            'admin_menu',
            'container',
            10,
            get_js_file_url("production/area.js", true),
            ["id"=> "menu"]
        );
        $response->addWidget(
            'admin_content',
            'container',
            20,
            get_js_file_url("production/area.js", true),
            [
                "id"=> "content"
            ]
        );

        return $delegate;
    }
}