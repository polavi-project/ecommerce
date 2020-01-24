<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Grid;

use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class GridMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('attribute-grid'))
            return $delegate;

        $this->getContainer()->get(Helmet::class)->setTitle("Product attributes");

        $response->addWidget(
            'attribute_grid_container',
            'content',
            0, get_js_file_url("production/grid/grid.js", true),
            ['id'=>"attribute_grid_container"]
        );

        $response->addWidget(
            'attribute_grid_title',
            'attribute_grid_container',
            0, get_js_file_url("production/catalog/attribute/grid/title.js", true)
        );

        $response->addWidget(
            'attribute_grid',
            'attribute_grid_container',
            10, get_js_file_url("production/catalog/attribute/grid/grid.js", true),
            [
                "apiUrl" => generate_url('admin.graphql.api')
            ]
        );

        return $delegate;
    }
}