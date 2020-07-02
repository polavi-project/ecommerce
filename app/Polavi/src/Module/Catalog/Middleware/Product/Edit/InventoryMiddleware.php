<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\Edit;

use function Polavi\get_default_language_Id;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

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
