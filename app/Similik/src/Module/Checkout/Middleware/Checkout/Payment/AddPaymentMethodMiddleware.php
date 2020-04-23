<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Checkout\Payment;


use Monolog\Logger;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class AddPaymentMethodMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()->get(Cart::class)
            ->setData('payment_method_name', $request->request->get('method_name'));
        $promise = $this->getContainer()->get(Cart::class)
            ->setData('payment_method', $request->request->get('method_code'));

        $promise->then(function($value) use ($response) {
            $response->addData('success', 1)->notNewPage();
        }, function ($reason) use ($response) {
            $response->addData('success', 0);
            $response->addAlert("checkout_shipping_method", "error", $reason);
            $response->notNewPage();
        });

        return $delegate;
    }
}