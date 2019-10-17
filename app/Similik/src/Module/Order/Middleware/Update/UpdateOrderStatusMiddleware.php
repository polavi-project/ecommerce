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
use Similik\Module\Order\Services\OrderUpdatePromise;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class UpdateOrderStatusMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$this->getContainer()->offsetExists(OrderUpdatePromise::class))
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

        $promise = $this->getContainer()->get(OrderUpdatePromise::class)->then(function(array $result) use($request, $statusMap) {
            $conn = _mysql();
            $changes = $result['changes'];
            $orgOrder = $result['orgOrder'];
            $status = null;
            $paymentStatus = $changes['payment_status'] ?? $orgOrder['payment_status'];
            $shipmentStatus = $changes['shipment_status'] ?? $orgOrder['shipment_status'];
            if(isset($statusMap[$orgOrder['payment_method'] . '/' . $paymentStatus . '/' . $shipmentStatus]))
                $status = $statusMap[$orgOrder['payment_method'] . '/' . $paymentStatus . '/' . $shipmentStatus];
            else if(isset($statusMap[$paymentStatus . '/' . $shipmentStatus]))
                $status = $statusMap[$paymentStatus . '/' . $shipmentStatus];
            else
                $status = 'pending';

            if($status == $orgOrder['status'])
                throw new \Exception("No status update");

            $conn->getTable('order')->where('order_id', '=', $orgOrder['order_id'])->update([
                'status'=> $status
            ]);

            return ['oldStatus'=>$orgOrder['status'],  'newStatus'=> $status];
        });

        return $promise;
    }
}