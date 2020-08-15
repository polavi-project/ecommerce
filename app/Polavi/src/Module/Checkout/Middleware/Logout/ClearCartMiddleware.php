<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Logout;


use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class ClearCartMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->getCustomer()->isLoggedIn() == true)
            return $delegate;

        $this->getContainer()->get(Cart::class)->destroy();
        $request->getSession()->remove('cart_id');

        return $delegate;
    }
}