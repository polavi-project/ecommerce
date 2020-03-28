<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\View;

use GuzzleHttp\Promise\Promise;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class PaginationMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('category_view_products_pagination') || !$delegate instanceof Promise)
            return $delegate;

        $delegate->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['productCollection']['currentFilter'])) {
                    $currentFilter = json_decode($result->data['productCollection']['currentFilter'], true);
                    $response->addWidget(
                        'category_view_products_pagination',
                        'category_products_container',
                        10,
                        get_js_file_url("production/catalog/product/list/pagination.js", false),
                        [
                            "total" => $result->data['productCollection']['total'],
                            "limit" => $currentFilter['limit']['value']
                        ]
                    );
                }
            });

        return $delegate;
    }
}
