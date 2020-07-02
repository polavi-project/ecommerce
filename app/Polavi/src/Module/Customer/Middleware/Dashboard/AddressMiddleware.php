<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Dashboard;


use function Polavi\create_mutable_var;
use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AddressMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> create_mutable_var("my_address_query", "{
                    customerAddresses (customerId: {$request->getCustomer()->getData('customer_id')}) {
                        customer_address_id
                        full_name
                        telephone
                        address_1
                        address_2
                        postcode
                        city
                        province
                        country
                        is_default
                        update_url
                        delete_url
                    }
                }")
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['customerAddresses'])) {
                    $response->addWidget(
                        'customer_adsdress',
                        'customer_dashboard_layout',
                        20,
                        get_js_file_url("production/customer/address/addresses.js", false),
                        [
                            'customer_id' => $request->getCustomer()->getData('customer_id'),
                            'addresses' => $result->data['customerAddresses'],
                            'createUrl' => generate_url('customer.address.create'),
                            'countries' => get_config('general_allow_countries', ["US"])
                        ]
                    );
                }
            });

        return $delegate;
    }
}