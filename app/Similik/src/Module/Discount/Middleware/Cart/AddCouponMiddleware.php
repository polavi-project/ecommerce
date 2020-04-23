<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Middleware\Cart;


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
        $promise = $cart->setData('coupon', $coupon);

        $promise->then(function($coupon) use ($request, $response) {
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));
        });

        $promise->otherwise(function($reason) use ($response) {
            $response->addAlert('coupon_apply_error', 'error', "Invalid coupon")->notNewPage();
        });
    }
}