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
                            itemId: order_item_id
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
                if(isset($result->data['orderItems'])) {
                    $response->addWidget(
                        'order_items',
                        'order_edit_left',
                        10,
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
