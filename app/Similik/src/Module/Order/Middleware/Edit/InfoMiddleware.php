<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Edit;

use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

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
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['order_info'])) {
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
