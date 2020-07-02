<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Edit;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class ItemsMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    orderItems: order (id: {$request->attributes->get('id')}) {
                        items {
                            item_id: order_item_id
                            product_id
                            product_sku
                            product_name
                            product_price
                            qty
                            final_price
                            options {
                                option_id
                                option_name
                                values {
                                    value_id
                                    value_text
                                    extra_price
                                }
                            }
                            total
                        }
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(empty($result->errors)) {
                    $response->addWidget(
                        'order_items',
                        'order_edit_left',
                        15,
                        get_js_file_url("production/order/edit/items.js", true),
                        [
                            'items'=> $result->data['orderItems']['items']
                        ]
                    );
                }
            });

        return $delegate;
    }
}
