<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Cart\Add;


use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class ButtonMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == false && $request->getMethod() == "GET")
            $response->addWidget(
                'add_to_cart_button',
                'product_item',
                50,
                get_js_file_url("production/checkout/cart/buy_button.js", false),
                [
                    "addItemApi" => generate_url('cart.add')
                ]
            );

        return $delegate;
    }
}