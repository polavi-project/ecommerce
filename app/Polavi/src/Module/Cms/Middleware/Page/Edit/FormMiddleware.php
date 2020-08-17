<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Middleware\Page\Edit;

use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->attributes->get('_matched_route') == 'page.edit')
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=>"{
                        cmsPage(id: {$request->get('id')})
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
                ])->then(function ($result) use ($request, $response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if (isset($result->data['cmsPage'])) {
                        $response->addWidget(
                            'page-edit-form',
                            'content',
                            10,
                            get_js_file_url("production/cms/page/edit/page_edit_form.js", true),
                            $result->data['cmsPage'] + [
                                "action" => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api", ['type'=> 'createCmsPage']),
                                "pageId" => $request->attributes->get('id'),
                                "listUrl" => generate_url('page.grid'),
                                "cancelUrl" => $request->attributes->get('id') ? generate_url('page.edit', ['id' => $request->attributes->get('id')]) : generate_url('page.create')
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
                    "action" => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api", ['type'=> 'createCmsPage']),
                    "listUrl" => generate_url('page.grid'),
                    "cancelUrl" => $request->attributes->get('id') ? generate_url('page.edit', ['id' => $request->attributes->get('id')]) : generate_url('page.create')
                ]
            );

        return $delegate;
    }
}
