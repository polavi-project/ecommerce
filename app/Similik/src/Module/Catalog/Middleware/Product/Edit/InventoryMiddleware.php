<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Edit;

use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class InventoryMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('product_edit_inventory'))
            return $delegate;

//        // Loading data by using GraphQL
        if($request->attributes->get('_matched_route') == 'product.edit')
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=>"{
                        inventory: product(id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())})
                        {
                            manage_stock
                            tax_class
                            qty
                            stock_availability
                        }
                    }"
                ])->then(function($result) use ($response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if(isset($result->data['inventory'])) {
                        $response->addWidget(
                            'product_edit_inventory',
                            'admin_product_edit_inner_right',
                            20,
                            get_js_file_url("production/catalog/product/edit/inventory.js", true),
                            ["id"=>"product_edit_inventory", "data" => $result->data['inventory']]
                        );
                    }
                });
        else
            $response->addWidget(
                'product_edit_inventory',
                'admin_product_edit_inner_right',
                20,
                get_js_file_url("production/catalog/product/edit/inventory.js", true),
                ["id"=>"product_edit_inventory"]
            );

        return $delegate;
    }
}
