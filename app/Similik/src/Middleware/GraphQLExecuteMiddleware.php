<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;


use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class GraphQLExecuteMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$this->getContainer()->get(GraphqlExecutor::class)->getOperationParams() ||
            $request->attributes->get('_matched_route') == 'graphql.api' ||
            $request->attributes->get('_matched_route') == 'admin.graphql.api'
        )
            return $delegate;

        $this->getContainer()->get(GraphqlExecutor::class)->execute();
        return $delegate;
    }
}