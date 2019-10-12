<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Checkout\Order;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class CreateOrderMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $cart = $this->getContainer()->get(Cart::class);
        $promise = $cart->createOrder();
        $promise->then(function($orderId) use ($request) {
            $request->getSession()->set('orderId', $orderId);
        } ,function(\Exception $e) use ($response) {
            $response->addAlert('create_order_error', 'error', $e->getMessage())->notNewPage();
        });

        return $promise;
    }
}