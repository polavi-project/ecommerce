<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Update\Shipment;


use GuzzleHttp\Promise\Promise;
use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use function Polavi\subscribe;

class CompleteShipmentMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $promise = new Promise(function() use($request, $response, &$promise) {
            $conn = _mysql();
            $id = $request->attributes->get('id');
            $order = $conn->getTable('order')->load($id);
            if ($order['shipment_status'] !== "delivering")
                throw new \Exception("Shipment is either completed or not started yet");
            $conn->getTable('order')->where('order_id', '=', $id)->update(['shipment_status'=>'delivered']);
            $promise->resolve($id);
        });

        $promise->then(function($id) use ($response) {
            $response->addAlert("order_update", "success", "Order updated")->notNewPage();
        });

        $promise->otherwise(function($reason) use ($response){
            if ($reason instanceof \Exception)
                $response->addAlert("order_update", "error", $reason->getMessage())->notNewPage();
            else
                $response->addAlert("order_update", "error", $reason)->notNewPage();
        });

        subscribe("route_middleware_ended", function() use ($promise) {
            $promise->wait();
        });

        return $promise;
    }
}