<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Middleware\AreaWidget;


use function Polavi\array_find;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AreaWidgetMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true)
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{areaWidgets : widgetCollection (filters : [{key: \"type\" operator : \"=\" value: \"area\"}]) {widgets { cms_widget_id name setting {key value} displaySetting {key value} sort_order }}}"
            ])->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['areaWidgets'])) {
                    $matchedRoute = $request->attributes->get('_matched_route');
                    $widgets = array_filter($result->data['areaWidgets']['widgets'], function($v) use($matchedRoute) {
                        $layouts = array_find($v['displaySetting'], function($value, $key) {
                            if($value['key'] == 'layout')
                                return json_decode($value['value'], true);
                            return null;
                        }, []);

                        $match = false;
                        foreach ($layouts as $layout) {
                            if($matchedRoute == $layout || $layout == "all") {
                                $match = true;
                                break;
                            }
                        }
                        return $match;
                    }, ARRAY_FILTER_USE_BOTH);
                    foreach ($widgets as $widget) {
                        $areaId = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'id')
                                return $value['value'];
                            return null;
                        });

                        $template = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'template')
                                return $value['value'];
                            return null;
                        });

                        $containerClass = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'container_class')
                                return $value['value'];
                            return null;
                        });

                        $columns = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'columns') {
                                try {
                                    $columns = json_decode($value['value'], true);
                                    if (JSON_ERROR_NONE !== json_last_error()) {
                                        throw new \InvalidArgumentException(json_last_error_msg());
                                    }
                                    return $columns;
                                } catch (\Exception $e) {
                                    return [];
                                }
                            }
                            return [];
                        });

                        $areas = [];
                        foreach ($widget['displaySetting'] as $key => $value) {
                            if($value['key'] == 'area')
                                $areas = array_merge($areas, json_decode($value['value'], true));
                            if($value['key'] == 'area_manual_input')
                                $areas = array_merge($areas, explode(",", $value['value']));
                        }

                        foreach ($areas as $area)
                            $response->addWidget(
                                $widget['cms_widget_id'] . '-area-widget',
                                trim($area),
                                (int)$widget['sort_order'],
                                get_js_file_url("production/cms/widget/area_widget.js", false),
                                [
                                    "id" => $widget['cms_widget_id'] . '-area-widget',
                                    "areaId" => $areaId,
                                    "name" => $widget['name'],
                                    "template" => $template,
                                    "containerClass" => $containerClass,
                                    "columns" => $columns
                                ]
                            );
                    }
                }
            });

        return $delegate;
    }
}