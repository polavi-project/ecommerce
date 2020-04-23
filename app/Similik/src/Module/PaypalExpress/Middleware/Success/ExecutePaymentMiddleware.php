<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\PaypalExpress\Middleware\Success;

use Similik\Http\Request;
use Similik\Services\Sale\Order;
use Similik\Middleware\Delegate;
use Similik\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Middleware\Checkout\Orderbk\CreateOrderMiddleware;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;

class ExecutePaymentMiddleware extends CreateOrderMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $cart = the_cart();
        $paypal = $delegate->getPaypalApiContext();
        $transaction = $delegate->getTransaction();
        $payment_id = $request->get('paymentId', null);
        $payer_id = $request->get('PayerID', null);
        if(
            !$paypal or
            !$transaction or
            !$payment_id or
            !$payer_id
        ) {
            the_app()->get(Session::class)->getFlashBag()->add('error', 'Something wrong, please try again');
            $delegate->stopAndResponse(new RedirectResponse(build_url('checkout/cart')));
            return $next($request, $response, $delegate);
        }
        $payment = Payment::get($payment_id, $paypal);
        $execute = new PaymentExecution();
        $execute->setPayerId($payer_id);
        $execute->addTransaction($transaction);
        try {
            $data_for_order = $cart->getData();
            $data_for_order['shipping_address'] = $this->getTable('cart_address')
                ->where('cart_address_cart_id', '=', the_cart()->getCartId())
                ->andWhere('address_type', '=', 'shipping')
                ->fetchOneAssoc();
            $data_for_order['billing_address'] = $this->getTable('cart_address')
                ->where('cart_address_cart_id', '=', the_cart()->getCartId())
                ->andWhere('address_type', '=', 'billing')
                ->fetchOneAssoc();
            $data_for_order['payment_method'] = 'paypal_express';
            $this->getProcessor()->startTransaction();
            $order_id = parent::createOrder($data_for_order);
            // Add activity
            $this->getTable('order_activity')->insert([
                'order_activity_order_id'=>$order_id,
                'customer_notified'=>1,
                'comment'=>__('Order created')
            ]);
            $result = $payment->execute($execute, $paypal);
            //$payment = Payment::get($payment_id, $paypal);
            $this->getProcessor()->commit();
            $order = new Order($order_id);
            $delegate->setPlacedOrder($order);
            $payment_action = $payment->getIntent();
            $transaction = $payment->transactions[0];
            switch ($payment_action) {
                case 'sale':
                    $transaction_data = ['transaction_id'=>$transaction->related_resources[0]->getSale()->getId()];
                    $this->getTable('order')->where('order_id', '=', $order_id)
                        ->update(['payment_status'=>2], ['payment_status']);
                    $transaction_data['payment_action'] = 'capture';
                    break;
                case 'authorize':
                    $transaction_data = ['transaction_id'=>$transaction->related_resources[0]->getAuthorization()->getId()];
                    $this->getTable('order')->where('order_id', '=', $order_id)
                        ->update(['payment_status'=>1], ['payment_status']);
                    $transaction_data['payment_action'] = 'authorize';
                    break;
            }
            $transaction_data['transaction_type'] = 'online';
            $transaction_data['amount'] = $data_for_order['grand_total'];
            $transaction_data['additional_information'] = $result->toJSON();
            $transaction_data['payment_transaction_order_id'] = $order_id;
            $this->getTable('payment_transaction')->insert($transaction_data);
            the_app()->get(Session::class)->set('last_success_order_number', $order_id);
            dispatch_event('after_order_create', [$order]);
            $delegate->stopAndResponse(new RedirectResponse(build_url('checkout/success')));
        } catch (\Exception $e) {
            $this->getProcessor()->rollback();
            the_app()->get(Session::class)->getFlashBag()->add('error', $e->getMessage());
            $delegate->stopAndResponse(new RedirectResponse(build_url('checkout/cart')));
        }
        return $next($request, $response, $delegate);
    }
}