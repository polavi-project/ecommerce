<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\SendGrid\Middleware\Order;


use GuzzleHttp\Promise\Promise;
use function Polavi\_mysql;
use function Polavi\get_config;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\SendGrid\Services\SendGrid;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

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
            $languageCode = get_config('general_default_language', "en");
            $fmt = new \NumberFormatter( $languageCode, \NumberFormatter::CURRENCY );

            array_walk($order, function(&$field, $key) use($fmt, $order) {
               if(in_array($key, [
                   'shipping_fee_excl_tax',
                   'shipping_fee_incl_tax',
                   'discount_amount',
                   'sub_total',
                   'tax_amount',
                   'grand_total',
               ]))
                   $field = $fmt->formatCurrency((floatval($field)), $order['currency']);
            });
            $items = $conn->getTable('order_item')->where('order_item_order_id', '=', $orderId)->fetchAllAssoc();
            foreach ($items as $key=> $val)
                array_walk($items[$key], function(&$field, $k) use($fmt, $order) {
                    if(in_array($k, [
                        'product_price',
                        'product_price_incl_tax',
                        'final_price',
                        'final_price_incl_tax',
                        'tax_amount',
                        'total',
                    ]))
                        $field = $fmt->formatCurrency(floatval($field), $order['currency']);
                });
            $order['items'] = $items;
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