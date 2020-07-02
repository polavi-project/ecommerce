<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Widget\ProductFilter;


use function Polavi\array_find;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class ProductFilterWidgetMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true)
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{productFilter : widgetCollection (filter : {type : {operator : \"=\" value: \"product_filter\"}}) {widgets { cms_widget_id name setting {key value} displaySetting {key value} sort_order }}}"
            ])->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['productFilter'])) {
                    $matchedRoute = $request->attributes->get('_matched_route');
                    $widgets = array_filter($result->data['productFilter']['widgets'], function($v) use($matchedRoute) {
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
                        $title = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'title')
                                return $value['value'];
                            return null;
                        });

                        $showCount = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'show_count')
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
                                $widget['cms_widget_id'] . '-product-filter-widget',
                                $area,
                                (int)$widget['sort_order'],
                                get_js_file_url("production/catalog/widgets/filter.js", false),
                                [
                                    "title" => $title
                                ]
                            );
                    }
                }
            }, function($reason) {var_dump($reason);});

        return $delegate;
    }
}