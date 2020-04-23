<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Middleware\Cart;

use function Similik\get_js_file_url;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

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