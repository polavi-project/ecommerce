<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Checkout\Index;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class ItemSummaryMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    items: cart {
                        items {
                            cart_item_id
                            product_id
                            name: product_name
                            productUrl
                            qty
                            total
                        }
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['items'])) {
                    $response->addWidget(
                        'checkout_summary_items',
                        'checkout_summary',
                        20,
                        get_js_file_url("production/checkout/checkout/summary/items.js"),
                        ["items" => $result->data['items']['items']]
                    );
                }
            });

        return $delegate;
    }
}