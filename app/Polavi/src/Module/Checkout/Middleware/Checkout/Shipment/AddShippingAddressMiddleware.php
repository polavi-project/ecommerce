<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Checkout\Shipment;


use GraphQL\Type\Schema;
use function Polavi\create_mutable_var;
use function Polavi\dirty_output_query;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AddShippingAddressMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $outPut = dirty_output_query($this->getContainer()->get(Schema::class), 'CustomerAddress');
        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query" => create_mutable_var("add_checkout_shipping_address_query", "mutation AddShippingAddress(\$address: AddressInput!, \$cartId: Int!) { addShippingAddress (address: \$address, cartId: \$cartId) {status message address $outPut}}"),
                "variables" => $request->get('variables', [])
            ]);

        $promise->then(function ($result) use ($request, $response) {
            $response->addData('add_checkout_shipping_address', $result->data['addShippingAddress'])
                    ->notNewPage();
        });

        $promise->otherwise(function ($reason) use ($request, $response) {
            // TODO: Support development mode and show real message
            $response->addData('add_checkout_shipping_address', ['status'=> false, 'message'=> $reason[0]->message])
                    ->notNewPage();
        });

        return $promise;
    }
}