<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Cart\Update;

use Similik\Services\Checkout\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;

class QtyMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @param Delegate|null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        try {
            $id = $request->attributes->get('id');
            $qty = $request->request->get('qty');
            $request->getApp()->get(Cart::class)->updateItemQty($id, $qty);
            $request->getApp()->get(Cart::class)->commit();
            $response->addAlert('cart_update_success', 'success', 'Cart updated');
            $response->addData("minicart", $request->getApp()->get(Cart::class)->toMiniCartJson());
        } catch (\Exception $e) {
            $response->addAlert('cart_update_error', 'error', $e->getMessage());
            $delegate->stopAndResponse();
        }
        return $next($request, $response, $delegate);
    }
}