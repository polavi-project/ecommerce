<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\Grid;

use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class ActionColumn extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'product-grid-action-column-header',
            'product_grid_header',
            60, get_js_file_url("production/catalog/product/grid/actionColumnHeader.js", true)
        );

        $response->addWidget(
            'product-grid-action-column-row',
            'product_grid_row',
            60, get_js_file_url("production/catalog/product/grid/actionColumnRow.js", true),
            [
                'deleteUrl' => generate_url('admin.graphql.api', ['type'=>'deleteProduct']),
            ]
        );

        return $delegate;
    }
}