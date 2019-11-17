<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\View;

use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
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
        if($response->hasWidget('category_view_products'))
            return $delegate;

        $limit = get_config('catalog_product_list_limit', 50);
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> <<< QUERY
                    {
                        productCollection (filter: { category : {operator: IN value: "{$request->get('id')}"} limit: {operator: Equal value: "{$limit}"}}) {
                                products {
                                    product_id
                                    name
                                    price
                                    salePrice
                                    url
                                    image {
                                        list
                                    }
                                }
                                total
                                currentFilter
                        }
                    }
QUERY
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['productCollection']['products'])) {
                    $products = $result->data['productCollection']['products'];
                    $response->addState('productCollectionRootFilter', json_decode($result->data['productCollection']['currentFilter'], true));
                    $response->addWidget(
                        'category_view_products',
                        'content',
                        10,
                        get_js_file_url("production/catalog/category/view/products.js", false),
                        [
                            "ps" => $products,
                            "currentFilter" => json_decode($result->data['productCollection']['currentFilter'], true),
                            "_total" => $result->data['productCollection']['total'],
                            "addItemApi" => generate_url('cart.add')
                        ]
                    );
                }
            }, function($reason) {var_dump($reason);});

        return $delegate;
    }
}
