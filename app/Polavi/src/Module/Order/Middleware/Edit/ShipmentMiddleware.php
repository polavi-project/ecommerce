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

class ShipmentMiddleware extends MiddlewareAbstract
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
                "query"=> create_mutable_var("order_edit_shipment_query", "{
                    shipment : order (id: {$request->attributes->get('id')}) {
                        order_id
                        currency
                        shipment_status
                        shipping_method
                        shipping_note
                        shipping_method_name
                        total_weight
                        grand_total
                    }
                }")
            ])
            ->then(function ($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['shipment'])) {
                    $response->addWidget(
                        'order_shipment',
                        'order_edit_left',
                        50,
                        get_js_file_url("production/order/edit/shipment.js", true),
                        array_merge($result->data['shipment'], [
                            'startShipUrl' => generate_url('order.ship.start', ['id'=>$request->attributes->get('id')]),
                            'completeShipUrl' => generate_url('order.ship.complete', ['id'=>$request->attributes->get('id')])
                        ])
                    );
                }
            });

        return $delegate;
    }
}
