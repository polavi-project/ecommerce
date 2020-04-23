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
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Response;

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