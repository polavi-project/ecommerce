<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Middleware\Cart;


use GuzzleHttp\Promise\RejectedPromise;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class AddCouponMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $coupon = $request->request->get('coupon');
        if (!$coupon)
            $promise = new RejectedPromise("Invalid coupon");
        else {
            $cart = $this->getContainer()->get(Cart::class);
            $promise = $cart->setData('coupon', $coupon);
        }

        $promise->then(function ($coupon) use ($request, $response) {
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));
        });

        $promise->otherwise(function ($reason) use ($response) {
            $response->addAlert('coupon_apply_error', 'error', "Invalid coupon")->notNewPage();
        });
    }
}