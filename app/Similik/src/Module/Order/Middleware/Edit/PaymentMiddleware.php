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

class PaymentMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    order_payment : order (id: {$request->attributes->get('id')}) {
                        order_id 
                        payment_status
                        payment_method
                        grand_total
                        payment_transaction {
                            id
                            transaction_id
                            transaction_type
                            amount
                            parent_transaction_id
                            payment_action
                            additional_information
                            created_at
                        }
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['order_payment'])) {
                    $response->addWidget(
                        'order_payment',
                        'order_edit_left',
                        40,
                        get_js_file_url("production/order/edit/payment.js", true),
                        [
                            'order_id'=> $result->data['order_payment']['order_id'],
                            'payment_status'=> $result->data['order_payment']['payment_status'],
                            'payment_method'=> $result->data['order_payment']['payment_method'],
                            'grand_total'=> $result->data['order_payment']['grand_total'],
                            'transactions'=> $result->data['order_payment']['payment_transaction'],
                        ]
                    );
                }
            });

        return $delegate;
    }
}
