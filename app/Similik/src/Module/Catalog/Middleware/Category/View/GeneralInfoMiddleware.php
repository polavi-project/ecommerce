<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\View;

use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class GeneralInfoMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('category_view_general'))
            return $delegate;

        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    general_info: category(id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())})
                    {
                        category_id 
                        name 
                        description 
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['general_info']) and $result->data['general_info']) {
                    $response->addWidget(
                        'category_view_general',
                        'content',
                        10,
                        get_js_file_url("production/catalog/category/view/general.js", false),
                        $result->data['general_info']
                    );
                }
            });

        return $delegate;
    }
}