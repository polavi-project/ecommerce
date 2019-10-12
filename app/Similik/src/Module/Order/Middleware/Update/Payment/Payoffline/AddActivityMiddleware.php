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

class AddActivityMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$delegate instanceof Promise)
            return $delegate;

        $delegate->then(function($orderId) {
            _mysql()->getTable('order_activity')->insert([
                'order_activity_order_id' => $orderId,
                'comment' => "Customer paid offline",
                'customer_notified' => 0
            ]);
        });

        return $delegate;
    }
}