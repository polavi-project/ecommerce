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

        parent::__construct(function() use ($orderId, $order){
            $conn = _mysql();
            $orderNew = $conn->getTable('order')->load($orderId);
            $diff = array_diff_assoc($orderNew, $order);
            $changes = [];
            foreach ($diff as $key=> $item) {
                $changes[$key]['from'] = $order[$key];
                $changes[$key]['to'] = $item;
            }

            $this->resolve($changes);
        });
    }
}