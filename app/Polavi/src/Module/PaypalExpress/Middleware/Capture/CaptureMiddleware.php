<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\PaypalExpress\Middleware\Capture;

use Polavi\Db\Mysql;
use Polavi\Http\Request;
use Polavi\Middleware\Delegate;
use Polavi\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use PayPal\Api\Amount;
use PayPal\Api\Authorization;
use PayPal\Api\Capture;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;
use Symfony\Component\HttpFoundation\RedirectResponse;

class CaptureMiddleware extends Mysql extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $order = $delegate->getOrder();
        if(get_request_param('online_capture') != 1 || $order['payment_method'] != 'paypal_express')
            return $next($request, $response, $delegate);
        $client_id = get_config('checkout_paypal_client_id', null);
        $secret = get_config('checkout_paypal_client_secret', null);
        $enable_log = get_config('checkout_paypal_enable_log', 1);
        $enable_log = ($enable_log == 1) ? true : false;

        $paypal = new ApiContext(
            new OAuthTokenCredential($client_id, $secret)
        );
        $paypal->setConfig(
            array(
                'log.LogEnabled' => $enable_log,
                'log.FileName' => CACHE_PATH . '/paypal.log',
                'log.LogLevel' => 'DEBUG', // PLEASE USE `INFO` LEVEL FOR LOGGING IN LIVE ENVIRONMENTS
            )
        );
        $order_id = $request->get('id');
        $transaction = $this->getTable('payment_transaction')
            ->where('payment_transaction_order_id', '=', $order_id)
            ->andWhere('payment_action', '=', 'authorize')
            ->fetchOneAssoc();
        if($transaction == false) {
            add_flash_session('error', __('No authorize transaction to capture'));
            $delegate->stopAndResponse(new RedirectResponse(build_url('order/edit/' . $order_id)));
            return $next($request, $response, $delegate);
        }
        $authorization_id = $transaction['transaction_id'];
        $this->getProcessor()->startTransaction();
        try {
            $authorization = Authorization::get($authorization_id, $paypal);
            $amt = new Amount();
            $amt->setCurrency($order['currency'])
                ->setTotal($order['grand_total']);

            ### Capture
            $capture = new Capture();
            $capture->setAmount($amt);

            $get_capture = $authorization->capture($capture, $paypal);
            $transaction['transaction_id'] = $get_capture->getId();
            $transaction['payment_transaction_order_id'] = $order_id;
            $transaction['transaction_type'] = 'online';
            $transaction['amount'] = $order['grand_total'];
            $transaction['parent_transaction_id'] = $authorization_id;
            $transaction['payment_action'] = 'capture';
            $transaction['additional_information'] = $get_capture->toJSON();

            $this->getTable('order')->where('order_id', '=', $order_id)->update(['payment_status'=>2]);
            $this->getTable('payment_transaction')->insert($transaction);
            // TODO: notify customer email
            $this->getTable('order_activity')->insert([
                'order_activity_order_id'=>$order_id,
                'customer_notified'=>1,
                'comment'=>__('Payment captured')
            ]);
            $this->getProcessor()->commit();
            add_flash_session('success', __('Captured successfully'));
        } catch (\Exception $e) {
            add_flash_session('error', $e->getMessage());
            $delegate->stopAndResponse(new RedirectResponse(build_url('order/edit/' . $order_id)));
        }
        return $next($request, $response, $delegate);
    }
}