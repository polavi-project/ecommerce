<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Grid;

use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

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