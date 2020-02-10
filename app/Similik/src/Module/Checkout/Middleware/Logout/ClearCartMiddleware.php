<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Logout;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class ClearCartMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getCustomer()->isLoggedIn() == true)
            return $delegate;

        $this->getContainer()->get(Cart::class)->destroy();
        $request->getSession()->remove('cart_id');

        return $delegate;
    }
}