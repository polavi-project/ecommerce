<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Address;


use function Polavi\dispatch_event;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class DeleteMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $variables = $request->get('variables', []);
        $variables['id'] = $request->attributes->get('id');

        $query = "mutation DeleteCustomerAddress(\$id: Int!) { deleteCustomerAddress (id: \$id) {status message addressId}}";

        dispatch_event("filter_delete_customer_address_query", [&$query]);

        $response->notNewPage();
        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query" => $query,
                "variables" => $variables
            ]);

        $promise->then(function ($result) use ($request, $response) {
            $response->addData('addressDelete', $result->data['deleteCustomerAddress']);
        });

        $promise->otherwise(function ($reason) use ($request, $response) {
            // TODO: Support development mode and show real message
            $response->addData('addressDelete', ['status'=> false, 'message'=> $reason[0]->message]);
        });

        return $promise;
    }
}