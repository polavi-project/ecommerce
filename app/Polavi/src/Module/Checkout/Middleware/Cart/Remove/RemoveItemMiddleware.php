<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Cart\Remove;

use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Module\Checkout\Services\Cart\Item;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class RemoveItemMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $promise = $this->getContainer()->get(Cart::class)->removeItem(
            (int) $request->attributes->get('id')
        );
        $promise->then(function (Item $item) use ($response) {
            if (!$item instanceof Item)
                $response->addAlert('cart_add_error', 'error', "Something wrong, please try again");
            else {
                $response->addAlert('cart_remove_success', 'success', "{$item->getData('product_name')} was removed from shopping cart successfully");
                $response->redirect($this->getContainer()->get(Router::class)->generateUrl('checkout.cart'));
            }
        });
        $promise->otherwise(function ($reason) use ($response) {
            $response->addAlert('cart_add_error', 'error', $reason)->notNewPage();
        });

        return $delegate;
    }
}