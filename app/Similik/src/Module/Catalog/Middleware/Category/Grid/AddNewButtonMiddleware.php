<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\Grid;

use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class AddNewButtonMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'category-grid-add-new',
            'content',
            5,
            get_js_file_url("production/catalog/category/grid/add_new_button.js", true),
            [
                "url" => generate_url('category.create')
            ]
        );

        return $delegate;
    }
}