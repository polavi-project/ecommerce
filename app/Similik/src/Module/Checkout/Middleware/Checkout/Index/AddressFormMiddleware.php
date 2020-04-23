<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Checkout\Index;

use GraphQL\Type\Schema;
use function Similik\dirty_output_query;
use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Response;

class AddressFormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'checkout_new_shipping_address_form',
            'checkout_shipping_address_block',
            30,
            get_js_file_url("production/checkout/checkout/address/new_shipping_address_form.js"),
            [
                "action" => generate_url('checkout.set.shipping.address'),
                "countries" => get_config('general_allow_countries', ["US"]),
            ]
        );

        $response->addWidget(
            'checkout_new_billing_address_form',
            'checkout_billing_address_block',
            30,
            get_js_file_url("production/checkout/checkout/address/new_billing_address_form.js"),
            [
                "action" => generate_url('checkout.set.billing.address'),
                "countries" => get_config('general_allow_countries', ["US"]),
            ]
        );

        $response->addWidget(
            'checkout_use_shipping_address_checkbox',
            'checkout_billing_address_block',
            20,
            get_js_file_url("production/checkout/checkout/address/use_shipping_address.js"),
            [
                "action" => generate_url('checkout.set.billing.address')
            ]
        );

        $response->addWidget(
            'new_address_cartId_field',
            'customer_address_form_inner',
            15,
            get_js_file_url("production/form/fields/hidden.js"),
            [
                "name"=>"variables[cartId]",
                "value" => $this->getContainer()->get(Cart::class)->getData('cart_id')
            ]
        );

        return $delegate;
    }
}