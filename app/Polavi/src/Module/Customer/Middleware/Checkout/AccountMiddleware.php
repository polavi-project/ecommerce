<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Checkout;


use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AccountMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        $response->addWidget(
            'checkout.login.form',
            'checkout_page',
            5,
            get_js_file_url("production/customer/checkout/contact_form.js"),
            [
                "loginUrl" => generate_url('customer.auth'),
                "setContactUrl" => generate_url('checkout.set.contact')
            ]
        );
    }
}