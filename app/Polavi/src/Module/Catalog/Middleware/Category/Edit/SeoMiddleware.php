<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Category\Edit;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class SeoMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($response->hasWidget('category_edit_seo'))
            return $delegate;

        // Loading data by using GraphQL
        if ($request->attributes->get('_matched_route') == 'category.edit')
            $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{generalInfo: category(id: {$request->get('id')}){seo_key meta_title meta_description meta_keywords}}"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['generalInfo'])) {
                    $response->addWidget(
                        'category_edit_seo',
                        'admin_category_edit_inner_left',
                        20,
                        get_js_file_url("production/catalog/category/edit/seo.js", true),
                        ["id"=>"category_edit_seo", "data" => $result->data['generalInfo']]
                    );
                }
            });
        else
            $response->addWidget(
                'category_edit_seo',
                'admin_category_edit_inner_left',
                20,
                get_js_file_url("production/catalog/category/edit/seo.js", true),
                ["id"=>"category_edit_seo", "data" => []]
            );
        return $delegate;
    }
}