<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace AmastyContactUs\Middleware;


use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class FormMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'cms_page_view',
            'content',
            10,
            get_js_file_url("production/cms/page/cms_page.js", false),
            [
                "id" => "contact_us",
                "name" => "Contact Us",
                "content" => "This is contact us page"
            ]
        );
    }
}