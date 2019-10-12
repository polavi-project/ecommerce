<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Cart\Add;

use function Similik\get_default_language_Id;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Module\Checkout\Services\Cart\Item;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class AddProductMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $selectedOptions = $request->request->get('custom_options', []);
        $promise = $this->getContainer()->get(Cart::class)->addItem(
            (int) $request->request->get('product_id'),
            (int) $request->request->get('qty'),
            $selectedOptions,
            (int) $request->getSession()->get('language', get_default_language_Id()),
            $request->request->all()
        )->then(function(Item $item) use ($response) {
            if($item->getError())
                throw new \Exception($item->getError());
            else
                $response->addAlert('cart_add_success', 'success', "{$item->getData('product_name')} was added to shopping cart successfully")->notNewPage();
        })->otherwise(function($reason) use ($response) {

            $response->addAlert('cart_add_error', 'error', $reason->getMessage())->notNewPage();
        });

        return $promise;
    }
}