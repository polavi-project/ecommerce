<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
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

class MenuWidgetMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->attributes->get('type') != 'menu')
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
                        categoryCollection {
                            categories {
                                category_id
                                name
                            }
                        }
                        pageCollection {
                            pages {
                                cms_page_id
                                name
                            }
                        }
                    }"
            ])->then(function($result) use (&$fields, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['cmsWidget'])) {
                    $response->addWidget(
                        'menu-widget-edit-form',
                        'widget-edit-form',
                        10,
                        get_js_file_url("production/cms/widget/menu/menu.js", true),
                        array_merge($result->data['cmsWidget'], [
                            'formAction' => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api"),
                            'categories' => $result->data['categoryCollection']['categories'],
                            'pages' => $result->data['pageCollection']['pages']
                        ])
                    );
                } else {
                    $response->addWidget(
                        'menu-widget-edit-form',
                        'widget-edit-form',
                        10,
                        get_js_file_url("production/cms/widget/menu/menu.js", true),
                        [
                            'formAction' => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api"),
                            'categories' => $result->data['categoryCollection']['categories'],
                            'pages' => $result->data['pageCollection']['pages']
                        ]
                    );
                }
            });

        return $delegate;
    }
}