<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Page\Grid;

use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class GridMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('page_grid'))
            return $delegate;

        $this->getContainer()->get(Helmet::class)->setTitle("CMS pages");

        $response->addWidget(
            'cms_page_grid_container',
            'content',
            0,
            get_js_file_url("production/grid/grid.js", true),
            ['id'=>"cms_page_grid_container"]
        );

        $response->addWidget(
            'page_grid_title',
            'cms_page_grid_container',
            0, get_js_file_url("production/cms/page/grid/title.js", true)
        );
        $response->addWidget(
            'cms_page_grid',
            'cms_page_grid_container',
            20, get_js_file_url("production/cms/page/grid/grid.js", true),
            [
                "apiUrl" => generate_url('admin.graphql.api')
            ]
        );

        return $delegate;
    }
}