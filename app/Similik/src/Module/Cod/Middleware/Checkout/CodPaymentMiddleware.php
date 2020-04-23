<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cod\Middleware\Checkout;


use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class CodPaymentMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return null
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $cart = $this->getContainer()->get(Cart::class);
        if(
            get_config('payment_cod_status') != 1 ||
            $cart->getData('grand_total') == 0
        )
            return $delegate;

        $response->addWidget(
            'cod_payment',
            'checkout_payment_method_block',
            (int) get_config('payment_cod_sort_order', 10),
            get_js_file_url("production/cod/cod.js"),
            [
                "label"=>get_config('payment_cod_name', "Cash on delivery", $request->getSession()->get('language', 0)),
                "status"=>get_config('payment_cod_status', 1),
                "minTotal"=>get_config('payment_cod_minimum', 0),
                "maxTotal"=>get_config('payment_cod_maximum'),
                "apiUrl" => generate_url('checkout.set.payment')
            ]
        );

        return $delegate;
    }
}