<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Dashboard;


use function Similik\dispatch_event;
use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class OrderMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'orders',
            'customer_dashboard_layout',
            30,
            get_js_file_url("production/customer/dashboard/orders.js", false),
            [
                'query' => dispatch_event()
            ]
        );
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    customer (id: {$request->getCustomer()->getData('customer_id')}) {
                        orders {
                            order_number 
                            status
                            created_at 
                            tax_amount
                            discount_amount 
                            coupon
                            grand_total
                            items {
                                order_item_id
                                product_id
                                product_sku
                                product_name
                                product_price
                                qty
                                final_price
                            }
                        }
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['customer']['orders'])) {

                }
            });

        return $delegate;
    }
}