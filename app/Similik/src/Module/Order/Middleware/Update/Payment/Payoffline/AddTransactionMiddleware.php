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

class AddTransactionMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$delegate instanceof Promise)
            return $delegate;

        $delegate->then(function($orderId) {
            $conn = _mysql();
            $order = $conn->getTable('order')->load($orderId);
            _mysql()->getTable('payment_transaction')->insert([
                'payment_transaction_order_id' => $orderId,
                'transaction_id' => "",
                'transaction_type' => "offline",
                'amount' => $order['grand_total'],
                'payment_action' => "Capture",
            ]);
        });

        return $delegate;
    }
}