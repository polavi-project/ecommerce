<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Symfony\Component\EventDispatcher\GenericEvent;

class WidgetMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        // register default widgets
        $request->getContainer()->registerWidget('text', "Free Text Widget");
        $request->getContainer()->registerWidget('search_form', "Search Form");
        $request->getContainer()->registerWidget('navigation', "Navigation");
        dispatch_event('register_widget', new GenericEvent($request));
        return $next($request, $response, $delegate);
    }
}