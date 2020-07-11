<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;

use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class BlockDeleteMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == false)
            return $delegate;

        if(strpos($request->attributes->get("_matched_route"), "delete") !== false) {
            $response->addAlert("demo_block_delete", "error", "This is demo side. Please do not remove anything. Thanks");
            $response->notNewPage();

            return $response;
        }

        return $delegate;
    }
}