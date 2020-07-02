<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Edit;

use function Polavi\create_mutable_var;
use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

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
                "query"=> create_mutable_var("order_edit_payment_query", "{
                    payment : order (id: {$request->attributes->get('id')}) {
                        orderId: order_id
                        currency
                        status: payment_status
                        method: payment_method
                        methodName: payment_method_name
                        grandTotal: grand_total
                        payment_transactions {
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
                }")
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['payment'])) {
                    $response->addWidget(
                        'order_payment',
                        'order_edit_left',
                        20,
                        get_js_file_url("production/order/edit/payment.js", true),
                        $result->data['payment']
                    );
                }
            });

        return $delegate;
    }
}
