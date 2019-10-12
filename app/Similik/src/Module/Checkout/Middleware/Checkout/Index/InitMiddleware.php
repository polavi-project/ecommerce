<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Checkout\Index;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class InitMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $cart = $this->getContainer()->get(Cart::class);
        if($cart->isEmpty())
            return $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));

        $items = $cart->getItems();
        foreach ($items as $item)
            if($item->getError())
                return $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));
        $this->getContainer()->get(Helmet::class)->setTitle('Checkout page');

        $cart->setData("payment_method", null);
        $cart->setData("shipping_method", null);

        $response->addWidget(
            'checkout_page',
            'content',
            20,
            get_js_file_url("production/checkout/checkout/checkout_page.js")
        );

        return $delegate;
    }
}