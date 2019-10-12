<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Update;


use GuzzleHttp\Promise\Promise;
use function Similik\_mysql;
use function Similik\dispatch_event;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class UpdateOrderStatusMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$delegate instanceof Promise)
            return $delegate;

        /* Payment method + Payment status + Shipment status*/
        $statusMap = [
            'pending/pending'=> 'pending',
            'cod/pending/pending'=> 'processing',
            'authorized/pending' => 'processing',
            'paid/pending' => 'processing',
            'pending/delivering' => 'processing',
            'authorized/delivering' => 'processing',
            'paid/delivering' => 'processing',
            'pending/delivered' => 'processing',
            'authorized/delivered' => 'processing',
            'paid/delivered' => 'completed',
        ];

        dispatch_event('filter_order_status_map', [&$statusMap]);

        $delegate->then(function($orderId) use ($statusMap) {
            $conn = _mysql();
            $order = $conn->getTable('order')->load($orderId);
            if(
                isset(
                    $statusMap[$order['payment_method'] . '/' .
                    $order['payment_status'] . '/' .
                    $order['shipment_status']]
                )
            )
                $conn->getTable('order')->where('order_id', '=', $orderId)->update([
                    'status'=> $statusMap[$order['payment_method'] . '/' . $order['payment_status'] . '/' . $order['shipment_status']]
                ]);
            else if(isset(
                $statusMap[
                    $order['payment_status'] . '/' .
                    $order['shipment_status']
                ]
            ))
                $conn->getTable('order')->where('order_id', '=', $orderId)->update([
                    'status'=> $statusMap[$order['payment_status'] . '/' . $order['shipment_status']]
                ]);
        });

        return $delegate;
    }
}