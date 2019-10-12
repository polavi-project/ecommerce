<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Core;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class MiniCartMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true || $request->attributes->get('_matched_route') == 'graphql.api')
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    mini_cart : cart {
                        grand_total,
                        item_count,
                        discount_amount
                        tax_amount
                        items {
                            url
                            qty
                            product_name
                            final_price
                        }
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['mini_cart'])) {
                    if($response->isNewPage())
                        $response->addWidget(
                            'minicart',
                            'header',
                            10,
                            get_js_file_url("production/checkout/minicart/container.js"),
                            array_merge(["id"=>"minicart"], $result->data['mini_cart'])
                        );
                    $response->addData('minicart', $result->data['mini_cart']);
                }
            });

        return $delegate;
    }
}