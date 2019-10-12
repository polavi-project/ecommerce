<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\HtmlDocument;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class InitHtmlMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAjax() || $request->getMethod() != "GET")
            return $delegate;

        $response->setContent($this->getContainer()->get(HtmlDocument::class)->getHtml());
        $response->headers->set('Content-Type', 'text/html');

        return $response;
    }
}