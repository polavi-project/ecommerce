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
use function Polavi\get_js_file_url;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Response;

class AddressBookMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $outPut = dirty_output_query($this->getContainer()->get(Schema::class), 'CustomerAddress');
        $customerId = $request->getCustomer()->getData('customer_id') ?? 0;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{customerAddresses(customerId: {$customerId}) {$outPut}}"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['customerAddresses'])) {
                    $response->addWidget(
                        'shipping_address_book',
                        'checkout_shipping_address_block',
                        20,
                        get_js_file_url("production/checkout/checkout/address/address_book.js"),
                        [
                            "addresses"=> $result->data['customerAddresses'],
                            "action" => generate_url('checkout.set.shipping.address'),
                            "cartId" => $this->getContainer()->get(Cart::class)->getData('cart_id')
                        ]
                    );

                    $response->addWidget(
                        'billing_address_book',
                        'checkout_billing_address_block',
                        20,
                        get_js_file_url("production/checkout/checkout/address/address_book.js"),
                        [
                            "addresses"=> $result->data['customerAddresses'],
                            "action" => generate_url('checkout.set.billing.address'),
                            "cartId" => $this->getContainer()->get(Cart::class)->getData('cart_id'),
                            "addressType" => "billing"
                        ]
                    );
                }
            });

        return $delegate;
    }
}