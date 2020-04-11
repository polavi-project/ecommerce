<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Dashboard;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class TitleMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('dashboard_title'))
            return $delegate;

        $this->getContainer()->get(Helmet::class)->setTitle("Dashboard");
        $response->addWidget(
            'dashboard_title',
            'content',
            0,
            get_js_file_url("production/cms/title.js", true),
            [
                "title" => "Dashboard"
            ]
        );

        return $delegate;
    }
}