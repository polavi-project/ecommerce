<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Services;


use GuzzleHttp\Promise\Promise;
use function Polavi\_mysql;

class OrderUpdatePromise extends Promise
{
    protected $orderId;

    public function __construct(int $orderId)
    {
        $conn = _mysql();
        $order = $conn->getTable('order')->load($orderId);
        if ($order == false)
            throw new \Exception('Order is not existed');

        parent::__construct(function () use ($order) {
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