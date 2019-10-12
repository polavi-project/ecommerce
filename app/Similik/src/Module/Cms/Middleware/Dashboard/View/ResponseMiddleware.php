<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Dashboard\View;

use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class ResponseMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @param Delegate|null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        the_app()->get(Head::class)->setTitle(__('Dashboard'));
        $firstname = the_user()->getFirstname();
        $lastname = the_user()->getLastname();
        the_app()->get(Body::class)->setContent("<h1>Welcome {$firstname} {$lastname}</h1>");

        return $next($request, $response, $delegate);
    }
}