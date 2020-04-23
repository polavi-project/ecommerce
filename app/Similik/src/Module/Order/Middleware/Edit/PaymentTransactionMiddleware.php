<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Edit;

use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class PaymentTransactionMiddleware extends MiddlewareAbstract
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
                    paymentTransactions (orderId: {$request->attributes->get('id')}) {
                        id
                        transaction_id
                        transaction_type
                        amount
                        parent_transaction_id
                        payment_action
                        additional_information
                        created_at
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['paymentTransactions'])) {
                    $response->addWidget(
                        'order_payment_transaction',
                        'order_payment_block',
                        40,
                        get_js_file_url("production/order/edit/payment.js", true),
                        [
                            'transactions'=> $result->data['paymentTransactions'],
                        ]
                    );
                }
            });

        return $delegate;
    }
}
