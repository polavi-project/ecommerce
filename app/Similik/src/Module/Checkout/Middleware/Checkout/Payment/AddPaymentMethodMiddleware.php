<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Checkout\Payment;


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
        }, function (\Exception $reason) use ($response) {
            $response->addData('success', 0)->addData('message', $reason->getMessage())->notNewPage();
        });

        return $delegate;
    }
}