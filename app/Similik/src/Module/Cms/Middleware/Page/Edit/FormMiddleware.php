<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Page\Edit;

use function Similik\get_config;
use function Similik\get_default_language_Id;
use function Similik\get_display_languages;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->attributes->get('_matched_route') == 'page.edit')
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=>"{
                        cmsPage(id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())})
                        {
                            name
                            status
                            content
                            layout
                            url_key
                            meta_title
                            meta_description
                            meta_keywords
                        }
                    }"
                ])->then(function($result) use ($request, $response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if(isset($result->data['cmsPage'])) {
                        $response->addWidget(
                            'page-edit-form',
                            'content',
                            10,
                            get_js_file_url("production/cms/page/edit/page_edit_form.js", true),
                            $result->data['cmsPage'] + [
                                "action" => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api", ['type'=> 'createCmsPage']),
                                "id" => $request->attributes->get('id')
                            ]
                        );
                    }
                });
        else
            $response->addWidget(
                'page-edit-form',
                'content',
                10,
                get_js_file_url("production/cms/page/edit/page_edit_form.js", true),
                [
                    "action" => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api", ['type'=> 'createCmsPage'])
                ]
            );

        return $delegate;
    }
}
