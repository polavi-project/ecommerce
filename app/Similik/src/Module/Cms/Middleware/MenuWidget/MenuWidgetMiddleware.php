<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\MenuWidget;


use function Similik\_mysql;
use function Similik\array_find;
use function Similik\get_current_language_id;
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
        if($request->isAdmin() == true)
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{menuWidgets : widgetCollection (filter : {type : {operator : \"=\" value: \"menu\"}}) {widgets { cms_widget_id name setting {key value} displaySetting {key value} sort_order }}}"
            ])->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['menuWidgets'])) {
                    $matchedRoute = $request->attributes->get('_matched_route');
                    $widgets = array_filter($result->data['menuWidgets']['widgets'], function($v) use($matchedRoute) {
                        $layouts = array_find($v['displaySetting'], function($value, $key) {
                            if($value['key'] == 'layout')
                                return json_decode($value['value'], true);
                            return null;
                        }, []);
                        if(empty($layouts))
                            return true;
                        $match = false;
                        foreach ($layouts as $layout) {
                            if($matchedRoute == $layout) {
                                $match = true;
                                break;
                            }
                            if (strpos($layout, '|') !== false) {
                                if(in_array($matchedRoute, explode('|', $layout))) {
                                    $match = true;
                                    break;
                                }
                            }
                        }
                        return $match;
                    }, ARRAY_FILTER_USE_BOTH);
                    foreach ($widgets as $widget) {
                        $items = [];
                        $conn = _mysql();
                        $category = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'category')
                                return json_decode($value['value'], true);
                            return null;
                        }, []);
                        foreach ($category as $c) {
                            $cat = $conn->getTable('category')
                                ->leftJoin('category_description', null, [
                                    [
                                        'column'      => "category_description.language_id",
                                        'operator'    => "=",
                                        'value'       => get_current_language_id(),
                                        'ao'          => 'and',
                                        'start_group' => null,
                                        'end_group'   => null
                                    ]
                                ])
                                ->where('category_id', '=', $c['id'])
                                ->andWhere('status', '=', 1)
                                ->fetchOneAssoc();
                            if($cat) {
                                if(!preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $cat['seo_key'] ?? ""))
                                    $url = $this->getContainer()->get(Router::class)->generateUrl('category.view', ["id"=>$cat['category_id']]);
                                else
                                    $url = $this->getContainer()->get(Router::class)->generateUrl('category.view.pretty', ["slug"=>$cat['seo_key']]);
                                $items[] = [
                                    'url'=> $url,
                                    'label' => $cat['name']
                                ];
                            }
                        }

                        $page = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'page')
                                return json_decode($value['value'], true);
                            return null;
                        }, []);

                        foreach ($page as $p) {
                            $pg= $conn->getTable('cms_page')
                                ->leftJoin('cms_page_description', null, [
                                    [
                                        'column'      => "cms_page_description.language_id",
                                        'operator'    => "=",
                                        'value'       => get_current_language_id(),
                                        'ao'          => 'and',
                                        'start_group' => null,
                                        'end_group'   => null
                                    ]
                                ])
                                ->where('cms_page_id', '=', $p['id'])
                                ->andWhere('status', '=', 1)
                                ->fetchOneAssoc();
                            if($pg) {
                                if(!preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $pg['url_key'] ?? ""))
                                    $url = $this->getContainer()->get(Router::class)->generateUrl('page.view', ["id"=>$pg['cms_page_id']]);
                                else
                                    $url = $this->getContainer()->get(Router::class)->generateUrl('page.view.pretty', ["slug"=>$pg['url_key']]);
                                $items[] = [
                                    'url'=> $url,
                                    'label' => $pg['name']
                                ];
                            }
                        }
                        $areas = array_find($widget['displaySetting'], function($value, $key) {
                            if($value['key'] == 'area')
                                return json_decode($value['value'], true);
                            return null;
                        }, []);
                        foreach ($areas as $area)
                            $response->addWidget(
                                $widget['cms_widget_id'] . '-menu-widget',
                                $area,
                                (int)$widget['sort_order'],
                                get_js_file_url("production/cms/widget/menu.js", false),
                                [
                                    "id" => $widget['cms_widget_id'] . '-menu-widget',
                                    "items" => $items
                                ]
                            );
                    }
                }
            });

        return $delegate;
    }
}