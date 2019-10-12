<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Grid;

use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class GridMiddleware extends MiddlewareAbstract
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
        $response->addWidget('attribute_grid', 'content', 20, Helper::getJsFileUrl("production/grid.js"), [
            "columns"=> $delegate->get('grid_columns'),
            "rows"=> $delegate->get('attributes'),
            "total"=> $delegate->get('total')
        ]);
        return $next($request, $response, $delegate);
    }
}