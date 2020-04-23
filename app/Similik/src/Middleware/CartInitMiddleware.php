<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function Similik\_mysql;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;

class CartInitMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true)
            return $delegate;
        $conn = _mysql();
        $cartId = null;
        $cartData = $conn->getTable('cart')
            ->where('cart_id', '=', $request->getSession()->get('cart_id'))
            ->andWhere('status', '=', 1)
            ->fetchOneAssoc();
        if(!$cartData)
            $request->getSession()->remove('cart_id');
        else
            $cartId = $request->getSession()->get('cart_id');

        if ($request->getCustomer()->isLoggedIn()) {
            $cart = $conn->getTable('cart')
                ->where('customer_id', '=', $request->getCustomer()->getData('customer_id'))
                ->andWhere('status', '=', 1)
                ->fetchOneAssoc();
            if($cart) {
                // Merge cart
                if($cartId && $cartId != $cart['cart_id']) {
                    $conn->getTable('cart_item')
                        ->where('cart_id', '=', $cart['cart_id'])
                        ->update(['cart_id'=>$cartData['cart_id']]);
                    $conn->getTable('cart')
                        ->where('cart_id', '=', $cart['cart_id'])
                        ->delete();
                    $cartId = (int)$cartData['cart_id'];
                } else {
                    $cartId = (int)$cart['cart_id'];
                }
            }
        }

        if($cartId)
            $this->getContainer()->get(Cart::class)->initFromId((int)$cartId);

        return $delegate;
    }
}