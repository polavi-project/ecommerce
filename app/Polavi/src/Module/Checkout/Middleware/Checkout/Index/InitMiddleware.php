<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Checkout\Index;


use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class InitMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $cart = $this->getContainer()->get(Cart::class);
        if ($cart->isEmpty())
            return $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));

        $items = $cart->getItems();
        foreach ($items as $item)
            if ($item->getError())
                return $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));
        $this->getContainer()->get(Helmet::class)->setTitle('Checkout page');

        $cart->setData("payment_method", null);
        $cart->setData("shipping_method", null);

        $response->addWidget(
            'checkout_page',
            'content_center',
            20,
            get_js_file_url("production/checkout/checkout/checkout_page.js")
        );

        return $delegate;
    }
}