<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\View;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

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
                        price: tier_price
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['productTierPrice'])) {
                    $response->addWidget(
                        'product_view_price',
                        'product_single_page_form',
                        30,
                        get_js_file_url("production/catalog/product/view/price.js", false),
                        ['tierPrices' => $result->data['productTierPrice']]
                    );
                }
            });

        return $delegate;
    }
}