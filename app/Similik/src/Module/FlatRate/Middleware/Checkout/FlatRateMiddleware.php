<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\FlatRate\Middleware\Checkout;


use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class FlatRateMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return null
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(
            get_config('shipment_flat_rate_status') != 1
        )
            return $delegate;

        $response->addWidget(
            'flat_rate_shipment',
            'checkout_shipping_method_block',
            (int) get_config('shipment_flat_rate_sort_order', 10),
            get_js_file_url("production/flat_rate/flat_rate.js"),
            [
                "label" => get_config("shipment_flat_rate_title", "Flat rate", $request->getSession()->get('language', 0)),
                "fee" => get_config("shipment_flat_rate_fee", 0),
                "countries" => get_config("shipment_flat_rate_countries", []),
                "apiUrl" => generate_url("checkout.set.shipment")
            ]
        );

        return $delegate;
    }
}