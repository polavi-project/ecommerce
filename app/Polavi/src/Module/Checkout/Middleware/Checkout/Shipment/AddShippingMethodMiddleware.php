<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Checkout\Shipment;


use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AddShippingMethodMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()->get(Cart::class)
            ->setData('shipping_method_name', $request->request->get('method_name'));
        $promise = $this->getContainer()->get(Cart::class)
            ->setData('shipping_method', $request->request->get('method_code'));

        $promise->then(function($value) use ($response) {
            $response->addData('success', 1);
            $response->notNewPage();
        }, function ($reason) use ($response) {
            $response->addData('success', 0)->addData('message', $reason);
            $response->addAlert("checkout_shipping_method", "error", "Something wrong. Please try again.");
            $response->notNewPage();
        });

        return $delegate;
    }
}