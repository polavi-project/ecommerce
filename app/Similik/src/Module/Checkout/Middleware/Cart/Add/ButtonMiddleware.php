<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Cart\Add;


use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

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