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

class ButtonMiddleware extends MiddlewareAbstract
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
        $response->addWidget(
            'attribute_grid_buttons',
            'content',
            15,
            Helper::getJsFileUrl("production/area.js"),
            ["id"=>"attribute_grid_buttons"]
        );
        $response->addWidget(
            'attribute_grid_add_new',
            'attribute_grid_buttons',
            10,
            Helper::getJsFileUrl("production/button.js"),
            [
                "url"=> build_url("attribute/create"),
                "text"=> "Add attribute",
                "classes"=>"uk-button uk-button-primary uk-button-small"
            ]
        );
        return $next($request, $response, $delegate);
    }
}