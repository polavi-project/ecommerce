<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Update\Payment\Payoffline;


use GuzzleHttp\Promise\Promise;
use function Similik\_mysql;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use function Similik\subscribe;

class PayMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $promise = new Promise(function() use($request, $response, &$promise) {
            $conn = _mysql();
            $id = $request->attributes->get('id');
            $order = $conn->getTable('order')->load($id);
            if($order['payment_status'] == "paid")
                throw new \Exception("Customer paid");
            $conn->getTable('order')->where('order_id', '=', $id)->update(['payment_status'=>'paid']);
            $promise->resolve($id);
        });

        $promise->then(function($id) use ($response) {
            $response->addAlert("order_update", "success", "Order updated")->notNewPage();
        })->otherwise(function($reason) use ($response) {
            if($reason instanceof \Exception)
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