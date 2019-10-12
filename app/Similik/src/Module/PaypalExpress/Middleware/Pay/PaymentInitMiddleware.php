<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\PaypalExpress\Middleware\Pay;

use Similik\Http\Request;
use Similik\Services\Checkout\Cart\Cart;
use Similik\Middleware\Delegate;
use Similik\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Transaction;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;
use Symfony\Component\HttpFoundation\RedirectResponse;

class PaymentInitMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        /** @var Cart $cart */
        $cart = the_cart();
        if($cart->getCartId() == null || !$cart->getItems()) {
            add_flash_session('error', __('Your cart is empty'));
            $delegate->stopAndResponse(new RedirectResponse(build_url('checkout/cart')));
        }
        if($delegate->getPaymentMethod() != null and $delegate->getPaymentMethod() != 'paypal_express')
            return $next($request, $response, $delegate);
        $client_id = get_config('checkout_paypal_client_id', null);
        $secret = get_config('checkout_paypal_client_secret', null);
        $mode = get_config('checkout_paypal_is_sandbox', 'sandbox');
        $enable_log = get_config('checkout_paypal_enable_log', 1);
        $enable_log = ($enable_log == 1) ? true : false;

        $paypal = new ApiContext(
            new OAuthTokenCredential($client_id, $secret)
        );
        $paypal->setConfig(
            array(
                'mode' => $mode,
                'log.LogEnabled' => $enable_log,
                'log.FileName' => CACHE_PATH . '/paypal.log',
                'log.LogLevel' => 'DEBUG', // PLEASE USE `INFO` LEVEL FOR LOGGING IN LIVE ENVIRONMENTS
            )
        );
        $payer = new Payer();
        $payer->setPaymentMethod('paypal');
        $items = [];
        $cart_items = $cart->getItems();
        foreach($cart_items as $item) {
            $p_item = new Item();
            $p_item->setName($item->getProductName())
                ->setSku($item->getProductSku())
                ->setCurrency($cart->getCurrency())
                ->setPrice($item->getSalePrice())
                ->setQuantity((int)$item->getQty())
                ->setTax($item->getTaxAmount());
            $items[] = $p_item;
        }
        $item_list = new ItemList();
        $item_list->setItems($items);
        // Detail
        $details = new Details();
        $details->setShipping($cart->getShippingFeeExclTax())
            ->setSubtotal($cart->getSubTotal())
            ->setTax($cart->getTaxAmount());
        // Amount
        $amount = new Amount();
        $amount->setCurrency($cart->getCurrency())
            ->setTotal($cart->getGrandTotal())
            ->setDetails($details);
        // Transaction
        $transaction = new Transaction();
        $transaction->setAmount($amount)
            ->setItemList($item_list)
            ->setDescription('Order #')
            ->setInvoiceNumber(uniqid());
        $delegate->setPaypalApiContext($paypal);
        $delegate->setPayer($payer);
        $delegate->setTransaction($transaction);
        return $next($request, $response, $delegate);
    }
}