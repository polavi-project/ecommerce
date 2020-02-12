<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Dashboard;

use function Similik\dispatch_event;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class InfoMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $query = "{customer (id: {$request->getCustomer()->getData('customer_id')}) {full_name email}}";
        dispatch_event("filter_customer_info_query", [&$query]);

        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query" => $query
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['customer'])) {
                    $response->addWidget(
                        'customer_info',
                        'customer_dashboard_layout',
                        10,
                        get_js_file_url("production/customer/dashboard/info.js", false),
                        ['action' => $this->getContainer()->get(Router::class)->generateUrl('customer.update', ['id'=>$request->getCustomer()->getData('customer_id')])]
                    );
                    $response->addState('customer', $result->data['customer']);
                }
            })->otherwise(function($reason) use($response) {
                // TODO: Log error to system.log
                $response->addAlert('customer_info_load_error', 'error', 'Something wrong. Please try again');
            });

        return $delegate;
    }
}