<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\View;

use function Similik\generate_url;
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

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> <<< QUERY
                    {
                        productCollection (filter: { category : {operator: IN value: "{$request->get('id')}"}}) {
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
                        }
                    }
QUERY
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['productCollection']['products'])) {
                    $products = $result->data['productCollection']['products'];
                    $response->addWidget(
                        'category_view_products',
                        'content',
                        10,
                        get_js_file_url("production/catalog/category/view/products.js", false),
                        [
                            "ps" => $products,
                            "categoryId" => $request->get('id'),
                            "addItemApi" => generate_url('cart.add')
                        ]
                    );
                }
            });

        return $delegate;
    }
}
