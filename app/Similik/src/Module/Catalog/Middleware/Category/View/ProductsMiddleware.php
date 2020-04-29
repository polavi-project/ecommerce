<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\View;

use function Similik\_mysql;
use function Similik\create_mutable_var;
use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Module\Catalog\Services\ProductCollection;
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

        $query = create_mutable_var("product_list_query", <<< QUERY
                    {
                        productCollection <FILTER> {
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
        );

        if(trim($request->query->get("query", "")) !== "")
            $query = str_replace("<FILTER>", trim($request->query->get("query", "")), $query);
        else
            $query = str_replace("<FILTER>", "", $query);

        // Apply category filter in advanced
        $stm = _mysql()
            ->getTable('product_category')
            ->addFieldToSelect("product_id")
            ->where('category_id', '=', $request->attributes->get('id'));
        $productIds = [];
        while ($row = $stm->fetch()) {
            $productIds[] = $row['product_id'];
        }
        $this->getContainer()->get(ProductCollection::class)->getCollection()->where('product.product_id', 'IN', $productIds);
        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> $query
            ]);

        $promise->then(function($result) use ($request, $response, $query) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['productCollection']['products'])) {
                    $products = $result->data['productCollection']['products'];
                    $response->addState('productCollectionFilter', json_decode($result->data['productCollection']['currentFilter'], true));
                    $response->addWidget(
                        'category_view_products',
                        'content',
                        10,
                        get_js_file_url("production/catalog/category/view/products.js", false),
                        [
                            "products" => $products,
                            "currentFilter" => json_decode($result->data['productCollection']['currentFilter'], true),
                            "total" => $result->data['productCollection']['total'],
                            "addItemApi" => generate_url('cart.add'),
                            "query" => $query,
                            "with_pagination" => create_mutable_var("with_pagination", true),
                            "with_sorting" => create_mutable_var("with_sorting", true),
                            "sorting_options" => create_mutable_var("sorting_options", [])
                        ]
                    );
                }
        }, function($reason) { var_dump($reason);});

        return $promise;
    }
}