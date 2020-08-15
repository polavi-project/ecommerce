<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Update\Payment;


use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class PayOfflineMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $id = $request->attributes->get('id');

            $conn = _mysql();
            $order = $conn->getTable('order')->load($id);
            if ($order['payment_status'] == "paid")
                throw new \Exception("Customer paid");
            $conn->getTable('order')->where('order_id', '=', $id)->update(['payment_status'=>'paid']);

            $conn->getTable('payment_transaction')->insert([
                'payment_transaction_order_id' => $id,
                'transaction_id' => "",
                'transaction_type' => "offline",
                'amount' => $order['grand_total'],
                'payment_action' => "Capture",
            ]);

            $response->addAlert("order_update", "success", "Order updated")->notNewPage();

            return $delegate;
        } catch (\Exception $e) {
            $response->addAlert("order_update", "error", $e->getMessage())->notNewPage();
            return $response;
        }
    }
}