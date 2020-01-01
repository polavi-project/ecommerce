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
use function Similik\get_current_language_id;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\SendGrid\Services\SendGrid;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Locale\Language;

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
            $languageCode = Language::listLanguagesV2()[get_current_language_id()][0] ?? 'en_US';
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