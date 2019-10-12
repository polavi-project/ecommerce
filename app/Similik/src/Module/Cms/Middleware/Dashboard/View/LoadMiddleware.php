<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Dashboard\View;

use Similik\Services\Db\Mysql;
use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class LoadMiddleware extends Mysql extends MiddlewareAbstract
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
        // TODO: Build dashboard
        the_app()->get(Head::class)->setTitle(__('Dashboard'));

        return $next($request, $response, $delegate);
    }
}