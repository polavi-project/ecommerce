<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Cart\Coupon;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class AddCouponMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $coupon = $request->request->get('coupon');
        $cart = $this->getContainer()->get(Cart::class);
        $cart->setData('coupon', $coupon)
            ->then(function($coupon) use ($request, $response) {
                $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));
            })
            ->otherwise(function($reason) use ($response) {
                $response->addAlert('coupon_apply_error', 'error', "Invalid coupon")->notNewPage();
            });
    }
}