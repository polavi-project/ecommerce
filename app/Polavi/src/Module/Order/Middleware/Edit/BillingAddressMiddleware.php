<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Edit;


use GraphQL\Type\Schema;
use function Polavi\dirty_output_query;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class BillingAddressMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $outPut = dirty_output_query($this->getContainer()->get(Schema::class), 'CustomerAddress');
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    billing_address : order (id: {$request->attributes->get('id')}) {
                        billing_address $outPut
                    }
                }"
            ])
            ->then(function ($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['billing_address'])) {
                    $response->addWidget(
                        'billing_address',
                        'order_edit_right',
                        10,
                        get_js_file_url("production/order/edit/billing_address.js", true),
                        [
                            'address' => $result->data['billing_address']['billing_address']
                        ]
                    );
                }
            });

        return $delegate;
    }
}