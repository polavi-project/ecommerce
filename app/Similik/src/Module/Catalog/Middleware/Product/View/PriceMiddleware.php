<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\View;

use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class PriceMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    productTierPrice (productId: {$request->attributes->getInt('id')})
                    {
                        qty
                        price
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['productTierPrice'])) {
                    $response->addWidget(
                        'product_view_price',
                        'product_view_general_info',
                        15,
                        get_js_file_url("production/catalog/product/view/price.js", false),
                        ['tierPrices' => $result->data['productTierPrice']]
                    );
                }
            });

        return $delegate;
    }
}