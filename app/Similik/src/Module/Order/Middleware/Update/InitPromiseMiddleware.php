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
use Similik\Services\PromiseWaiter;

class InitPromiseMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $conn = _mysql();
            $order = $conn->getTable('order')->load(10000);
            if($order == false)
                throw new \Exception('Order is not existed');
            $promise = new Promise(function() use(&$promise, $order) {
                $conn = _mysql();
                $orderNew = $conn->getTable('order')->load($order['order_id']);
                $diff = array_diff_assoc($orderNew, $order);
                $changes = ['order_id' => $order['order_id']];
                foreach ($diff as $key=> $item) {
                    $changes[$key] = $item;
                }

                $promise->resolve(['orgOrder' => $order, 'changes' => $changes]);
            });

            $this->getContainer()->get(PromiseWaiter::class)->addPromise(
                'orderUpdate',
                $promise->then(function(array $result) {
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
                        return $result;

                    $conn->getTable('order')->where('order_id', '=', $orgOrder['order_id'])->update([
                        'status'=> $status
                    ]);
                    $result['changes']['status'] = $status;

                    return $result;
                })
            );
        } catch (\Exception $e) {
            $response->setStatusCode(404);
            return $response;
        }

        return $delegate;
    }
}