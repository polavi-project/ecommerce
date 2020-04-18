<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Widget\Grid;


use function Similik\create_mutable_var;
use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class GridMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()->get(Helmet::class)->setTitle("Widgets");

        $response->addWidget(
            'cms_widget_grid_container',
            'content',
            0,
            get_js_file_url("production/grid/grid.js", true),
            [
                "id"=>"cms_widget_grid_container"
            ]
        );

        $response->addWidget(
            'widgets',
            'cms_widget_grid_container',
            20,
            get_js_file_url("production/cms/widget/grid/grid.js", true),
            [
                "apiUrl" => generate_url('admin.graphql.api'),
                "types" => create_mutable_var("widget_types", [])
            ]
        );

        return $delegate;
    }
}