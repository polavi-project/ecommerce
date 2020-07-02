<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Edit;

use function Polavi\_mysql;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class CustomerInfoMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // TODO: Use data loader to avoid loading same data twice
        if(!_mysql()->getTable('customer')->load($request->attributes->get('id'))) {
            $response->addAlert('customer_edit_error', 'error', 'Requested customer does not exist');
            return $response;
        }

        $this->getContainer()->get(Helmet::class)->setTitle('Edit customer');
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    customer (id: {$request->attributes->get('id')}) {
                        customer_id 
                        full_name 
                        status
                        email 
                        group_id  
                    }
                    customerGroups {
                        id: customer_group_id
                        name: group_name
                    }
                }"
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['customer'])) {
                    $response->addWidget(
                        'customer_info',
                        'content',
                        10,
                        get_js_file_url("production/customer/edit/form.js", true),
                        [
                            'customer'=> $result->data['customer'],
                            'groups'=> $result->data['customerGroups']
                        ]
                    );
                }
            });

        return $delegate;
    }
}
