<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\Grid;

use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class ButtonMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response)
    {
        $response->addWidget(
            'category_grid_add_new',
            'grid_buttons',
            10,
            get_js_file_url("production/a.js"),
            [
                "url"=> $this->getContainer()->get(Router::class)->generateUrl("category.create"),
                "text"=> "Add category",
                "classes"=>"uk-button uk-button-primary uk-button-small"
            ]
        );

        return true;
    }
}