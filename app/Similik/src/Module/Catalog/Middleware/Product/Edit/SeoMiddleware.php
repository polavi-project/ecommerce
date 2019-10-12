<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Edit;

use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class SeoMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('product_edit_seo'))
            return null;

//        // Loading data by using GraphQL
        if($request->attributes->get('_matched_route') == 'product.edit')
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=>"{seoInfo: product(id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())}){seo_key meta_title meta_description meta_keywords}}"
                ])->then(function($result) use (&$fields, $response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if(isset($result->data['seoInfo'])) {
                        $response->addWidget(
                            'product_edit_seo',
                            'admin_product_edit_inner',
                            50,
                            get_js_file_url("production/catalog/product/edit/seo.js", true),
                            ["id"=>"product_edit_seo", "data" => $result->data['seoInfo']]
                        );
                    }
                });
        else
            $response->addWidget(
                'product_edit_seo',
                'admin_product_edit_inner',
                50,
                get_js_file_url("production/catalog/product/edit/seo.js", true),
                ["id"=>"product_edit_seo"]
            );

        return $delegate;
    }
}
