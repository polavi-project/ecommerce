<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Middleware\Graphql;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\PromiseWaiter;

class AddServerExecutorPromiseMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($this->getContainer()->get(GraphqlExecutor::class)->getOperationParams() and
            $request->attributes->get('_matched_route') != 'graphql.api' and
            $request->attributes->get('_matched_route') != 'admin.graphql.api'
        ) {
            $this->getContainer()->get(PromiseWaiter::class)->addPromise(
                'serverGraphqlExecutor',
                $this->getContainer()->get(GraphqlExecutor::class)
            );
        }

        return $delegate;
    }
}