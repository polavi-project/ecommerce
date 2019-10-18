<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Services;


use GuzzleHttp\Promise\Promise;
use function Similik\_mysql;

class OrderUpdatePromise extends Promise
{
    protected $orderId;

    public function __construct(int $orderId)
    {
        $conn = _mysql();
        $order = $conn->getTable('order')->load($orderId);
        if($order == false)
            throw new \Exception('Order is not existed');

        parent::__construct(function() use ($order) {
            $conn = _mysql();
            $orderNew = $conn->getTable('order')->load($order['order_id']);
            $diff = array_diff_assoc($orderNew, $order);
            $changes = ['order_id' => $order['order_id']];
            foreach ($diff as $key=> $item) {
                $changes[$key] = $item;
            }

            $this->resolve(['orgOrder' => $order, 'changes' => $changes]);
        });
    }
}