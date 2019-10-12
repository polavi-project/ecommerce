<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Edit;

use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

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
                "query"=>"{
                    order_shipment : order (id: {$request->attributes->get('id')}) {
                        order_id 
                        shipment_status
                        shipping_method
                        shipping_fee: shipping_fee_excl_tax
                        shipping_note
                        total_weight
                        grand_total
                    }
                }"
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['order_shipment'])) {
                    $response->addWidget(
                        'order_shipment',
                        'order_edit_left',
                        50,
                        get_js_file_url("production/order/edit/shipment.js", true),
                        array_merge($result->data['order_shipment'], [
                            'startShipUrl' => generate_url('order.ship.start', ['id'=>$request->attributes->get('id')]),
                            'completeShipUrl' => generate_url('order.ship.complete', ['id'=>$request->attributes->get('id')])
                        ])
                    );
                }
            });

        return $delegate;
    }
}
