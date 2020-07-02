<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Middleware\Cart;

use function Polavi\get_js_file_url;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class CouponMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($this->getContainer()->get(Cart::class)->isEmpty())
            return $delegate;

        $response->addWidget(
            'shopping_cart_coupon',
            'shopping-cart-page',
            30,
            get_js_file_url("production/checkout/cart/coupon.js"),
            [
                "coupon"=> $this->getContainer()->get(Cart::class)->getData('coupon'),
                "action"=> $this->getContainer()->get(Router::class)->generateUrl('coupon.add')
            ]
        );

        return $delegate;
    }
}