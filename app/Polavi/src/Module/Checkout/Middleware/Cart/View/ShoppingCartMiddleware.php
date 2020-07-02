<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Cart\View;

use function Polavi\get_js_file_url;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class ShoppingCartMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()->get(Helmet::class)->setTitle('Shopping cart');
        $response->addWidget(
            'shopping_cart_page',
            'content',
            10,
            get_js_file_url("production/checkout/cart/shopping-cart.js"),
            [

            ]
        );

        return $delegate;
    }
}