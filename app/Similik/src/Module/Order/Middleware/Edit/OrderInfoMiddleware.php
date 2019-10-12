<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Edit;

use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class OrderInfoMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'order_information_container',
            'content',
            10,
            get_js_file_url("production/order/edit/order_edit.js", true),
            [
            ]
        );
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    order (id: {$request->attributes->get('id')}) {
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
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['order'])) {
                    $response->addWidget(
                        'order_info',
                        'order_edit_left',
                        10,
                        get_js_file_url("production/order/edit/info.js", true),
                        [
                            'order_number'=> $result->data['order']['order_number'],
                            'status'=> $result->data['order']['status'],
                            'created_at'=> $result->data['order']['created_at'],
                        ]
                    );
                    $response->addWidget(
                        'order_items',
                        'order_edit_left',
                        20,
                        get_js_file_url("production/order/edit/items.js", true),
                        [
                            'items'=> $result->data['order']['items']
                        ]
                    );
                    $response->addWidget(
                        'order_summary',
                        'order_edit_right',
                        30,
                        get_js_file_url("production/order/edit/summary.js", true),
                        [
                            'discount_amount'=> $result->data['order']['discount_amount'],
                            'tax_amount'=> $result->data['order']['tax_amount'],
                            'coupon'=> $result->data['order']['coupon'],
                            'grand_total'=> $result->data['order']['grand_total']
                        ]
                    );
                }
            });

        return $delegate;
    }
}
