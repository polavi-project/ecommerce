<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\PaypalExpress\Middleware\Success;

use Similik\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

class UpdateOrderMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $paypal = new ApiContext(
            new OAuthTokenCredential(get_config('checkout_paypal_client_id', null), get_config('checkout_paypal_client_secret', null))
        );
        $payment_id = $request->get('paymentId');
        $payer_id = $request->get('PayerID');
        $payment = Payment::get($payment_id, $paypal);
        $execute = new PaymentExecution();
        $execute->setPayerId($payer_id);
        try {
            $result = $payment->execute($execute, $paypal);
        } catch (\Exception $e) {

        }
        return $next($request, $response, $delegate);
    }
}