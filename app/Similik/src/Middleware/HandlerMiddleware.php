<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Module\Cms\Middleware\Page\View\NotFoundPageMiddleware;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\MiddlewareManager;

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