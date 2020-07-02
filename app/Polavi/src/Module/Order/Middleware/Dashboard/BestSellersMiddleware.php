<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Dashboard;


use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class BestSellersMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {

        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                        bestSellers(language: 0 limit: 10){
                            name
                            sku
                            price
                            qty
                            editUrl
                        }
                    }"
            ]);
        $promise->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['bestSellers'])) {
                    $response->addWidget(
                        'best_sellers',
                        'admin_dashboard_middle_left',
                        20,
                        get_js_file_url("production/order/dashboard/best_sellers.js", true),
                        [
                            'products' => $result->data['bestSellers'],
                            'listUrl' => generate_url("product.grid")
                        ]
                    );
                }
                return $result;
            });

        return $delegate;
    }
}