<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Graphql\Middleware\Graphql;


use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\PromiseWaiter;

class AddServerExecutorPromiseMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($this->getContainer()->get(GraphqlExecutor::class)->getOperationParams() and
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