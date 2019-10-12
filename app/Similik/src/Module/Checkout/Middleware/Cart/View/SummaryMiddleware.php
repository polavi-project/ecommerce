<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Cart\View;

use function Similik\get_js_file_url;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class SummaryMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($this->getContainer()->get(Cart::class)->isEmpty())
            return $delegate;

        $response->addWidget(
            'shopping_cart_summary',
            'shopping-cart-page',
            20,
            get_js_file_url("production/checkout/cart/summary.js"),
            [
                "sub_total"=> $this->getContainer()->get(Cart::class)->getData('sub_total'),
                "discount_amount"=> $this->getContainer()->get(Cart::class)->getData('discount_amount'),
                "tax_amount"=> $this->getContainer()->get(Cart::class)->getData('tax_amount'),
                "grand_total"=> $this->getContainer()->get(Cart::class)->getData('grand_total')
            ]
        );

        return $delegate;
    }
}