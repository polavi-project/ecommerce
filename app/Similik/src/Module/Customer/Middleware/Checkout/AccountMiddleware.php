<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Checkout;


use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

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