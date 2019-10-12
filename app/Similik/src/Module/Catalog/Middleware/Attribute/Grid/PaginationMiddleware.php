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

class PaginationMiddleware extends MiddlewareAbstract
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
        $setting = [
            'sort_by'    => $request->get('sort_by'),
            'sort_order' => $request->get('sort_order'),
            'page'       => $request->get('page'),
            'limit'      => $request->get('limit') ? $request->get('limit') : 20
        ];
        $mysql_collection = $delegate->get('mysql_collection');
        $for_total = clone $mysql_collection;
        $for_total->setFieldToSelect('COUNT(\'attribute_id\')', 'total');
        $count = $for_total->fetchAllAssoc($setting);
        $response->addWidget('attribute_grid_pagination', 'content', 10, Helper::getJsFileUrl("production/pagination.js"), [
            "total"=> $count[0]['total']
        ]);
        return $next($request, $response, $delegate);
    }
}