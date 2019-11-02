<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Middleware\Graphql;


use function Similik\generate_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class AddApiUrlStateMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin())
            $response->addState('graphqlApi', generate_url('admin.graphql.api'));
        else
            $response->addState('graphqlApi', generate_url('graphql.api'));

        return $delegate;
    }
}