<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Widget;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class TextWidgetMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->attributes->get('type') != 'text')
            return $delegate;

        $id = (int) $request->query->get('id');
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                        cmsWidget(id: {$id} )
                        {
                            id: cms_widget_id
                            name
                            status
                            setting {
                                key
                                value
                            }
                            displaySetting {
                                key
                                value
                            }
                            sort_order
                        }
                    }"
            ])->then(function($result) use (&$fields, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['cmsWidget'])) {
                    $response->addWidget(
                        'text-widget-edit-form',
                        'widget-edit-form',
                        10,
                        get_js_file_url("production/cms/widget/text/text.js", true),
                        array_merge($result->data['cmsWidget'], [
                            'formAction' => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api")
                        ])
                    );
                } else {
                    $response->addWidget(
                        'text-widget-edit-form',
                        'widget-edit-form',
                        10,
                        get_js_file_url("production/cms/widget/text/text.js", true),
                        [
                            'formAction' => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api")
                        ]
                    );
                }
            });

        return $delegate;
    }
}