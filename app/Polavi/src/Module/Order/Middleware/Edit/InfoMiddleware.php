<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Edit;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class InfoMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    order_info : order (id: {$request->attributes->get('id')}) {
                        order_id
                        order_number
                        customer_full_name
                        customer_email
                        created_at
                    }
                }"
            ])
            ->then(function ($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['order_info'])) {
                    $response->addWidget(
                        'order_info',
                        'order_edit_left',
                        10,
                        get_js_file_url("production/order/edit/info.js", true),
                        $result->data['order_info']
                    );
                }
            });

        return $delegate;
    }
}
