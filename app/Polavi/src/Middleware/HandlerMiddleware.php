<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;

use Polavi\Module\Cms\Middleware\Page\View\NotFoundPageMiddleware;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\MiddlewareManager;

class HandlerMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->getStatusCode() == 405)
            return $response;

        $routedMiddleware = $request->attributes->get('_routed_middleware');

        if($response->getStatusCode() == 404) {
            $routedMiddleware = [NotFoundPageMiddleware::class];
        }

        $mm = new MiddlewareManager($this->getContainer(), $routedMiddleware);

        return $mm->run();
    }
}