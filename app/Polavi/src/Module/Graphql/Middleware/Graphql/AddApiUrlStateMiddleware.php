<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Graphql\Middleware\Graphql;


use function Polavi\generate_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

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