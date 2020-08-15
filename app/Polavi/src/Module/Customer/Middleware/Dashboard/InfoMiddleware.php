<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Dashboard;

use function Polavi\create_mutable_var;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class InfoMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $query = create_mutable_var("filter_customer_info_query", "{customer (id: {$request->getCustomer()->getData('customer_id')}) {full_name email}}");

        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query" => $query
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['customer'])) {
                    $response->addWidget(
                        'customer_info',
                        'customer_dashboard_layout',
                        10,
                        get_js_file_url("production/customer/info.js", false),
                        ['action' => $this->getContainer()->get(Router::class)->generateUrl('customer.update', ['id'=>$request->getCustomer()->getData('customer_id')])]
                    );
                }
            })->otherwise(function($reason) use($response) {
                // TODO: Log error to system.log
                $response->addAlert('customer_info_load_error', 'error', 'Something wrong. Please try again');
            });

        return $delegate;
    }
}