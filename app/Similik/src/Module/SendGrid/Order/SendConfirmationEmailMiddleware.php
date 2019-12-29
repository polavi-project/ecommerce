<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\SendGrid\Order;


use GuzzleHttp\Promise\Promise;
use function Similik\_mysql;
use function Similik\get_config;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\SendGrid\Services\SendGrid;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class SendConfirmationEmailMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$delegate instanceof Promise)
            return $delegate;

        $delegate->then(function($orderId) use($request, $response) {
            $templateId = get_config('sendgrid_order_confirmation_email');
            $conn = _mysql();
            $order = $conn->getTable('order')->load($orderId);
            $order['items'] = $conn->getTable('order_item')->where('order_item_order_id', '=', $orderId)->fetchAllAssoc();
            $this->getContainer()->get(SendGrid::class)->sendEmail(
                'order_confirmation',
                $order['customer_email'],
                $templateId,
                ['order'=>$order]
            );
        });

        return $delegate;
    }
}