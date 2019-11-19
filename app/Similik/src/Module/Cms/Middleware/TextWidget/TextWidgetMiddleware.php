<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\TextWidget;


use function Similik\array_find;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class TextWidgetMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true)
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{textWidgets : widgetCollection (filter : {type : {operator : \"=\" value: \"text\"}}) {widgets { cms_widget_id name setting {key value} displaySetting {key value} sort_order }}}"
            ])->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['textWidgets'])) {
                    $matchedRoute = $request->attributes->get('_matched_route');
                    $widgets = array_filter($result->data['textWidgets']['widgets'], function($v) use($matchedRoute) {
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
                        $content = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'content')
                                return $value['value'];
                            return null;
                        });

                        $containerClass = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'container_class')
                                return $value['value'];
                            return null;
                        });

                        $areas = array_find($widget['displaySetting'], function($value, $key) {
                            if($value['key'] == 'area')
                                return json_decode($value['value'], true);
                            return null;
                        }, []);
                        foreach ($areas as $area)
                            $response->addWidget(
                                $widget['cms_widget_id'] . '-text-widget',
                                $area,
                                (int)$widget['sort_order'],
                                get_js_file_url("production/cms/widget/text_widget.js", false),
                                [
                                    "id" => $widget['cms_widget_id'] . '-text-widget',
                                    "name" => $widget['name'],
                                    "content" => $content,
                                    "containerClass" => $containerClass
                                ]
                            );
                    }
                }
            });

        return $delegate;
    }
}