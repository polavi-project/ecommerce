<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Marketing\Middleware\Newsletter;


use function Polavi\_mysql;
use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class GridMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('subscriber_grid'))
            return $delegate;

        $this->getContainer()->get(Helmet::class)->setTitle("Subscribers");
        $response->addWidget(
            'subscriber_grid_container',
            'content',
            0,
            get_js_file_url("production/grid/grid.js", true),
            ['id'=>"subscriber_grid_container"]
        );

        $response->addWidget(
            'subscriber_grid',
            'subscriber_grid_container',
            20,
            get_js_file_url("production/marketing/newsletter/grid.js", true),
            [
                "apiUrl" => generate_url('admin.graphql.api')
            ]
        );

        return $delegate;
    }
}