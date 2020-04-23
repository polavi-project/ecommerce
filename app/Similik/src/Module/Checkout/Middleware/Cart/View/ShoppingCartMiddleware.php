<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Cart\View;

use function Similik\get_js_file_url;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

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