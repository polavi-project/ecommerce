<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\Edit;

use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class ProductsMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('category_edit_products'))
            return $delegate;

        if($request->attributes->get('_matched_route') == 'category.edit')
            $response->addWidget(
                'product_grid',
                'admin_category_edit_inner_right',
                10, get_js_file_url("production/catalog/category/edit/products.js", true),
                [
                    "apiUrl" => generate_url('admin.graphql.api'),
                    "categoryId"=> $request->attributes->get('id')
                ]
            );

        return $delegate;
    }
}
