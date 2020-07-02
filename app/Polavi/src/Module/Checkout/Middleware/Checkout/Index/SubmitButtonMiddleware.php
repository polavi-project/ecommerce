<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Checkout\Index;

use GraphQL\Type\Schema;
use function Polavi\dirty_output_query;
use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_js_file_url;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Response;

class SubmitButtonMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'checkout_button',
            'checkout_summary_cart',
            80,
            get_js_file_url("production/checkout/checkout/checkout_button.js"),
            [
                "action" => generate_url('checkout.order'),
                "cartId" => $this->getContainer()->get(Cart::class)->getData('cart_id')
            ]
        );

        return $delegate;
    }
}