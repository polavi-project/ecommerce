<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Marketing\Middleware\SubscribeFormWidget;


use function Polavi\array_find;
use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class NewsletterFormWidgetMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true)
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{newsletterFormWidgets : widgetCollection (filter : {type : {operator : \"=\" value: \"newsletter_form\"}}) {widgets { cms_widget_id name setting {key value} displaySetting {key value} sort_order }}}"
            ])->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['newsletterFormWidgets'])) {
                    $matchedRoute = $request->attributes->get('_matched_route');
                    $widgets = array_filter($result->data['newsletterFormWidgets']['widgets'], function($v) use($matchedRoute) {
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

                        $htmlBefore = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'html_before')
                                return $value['value'];
                            return null;
                        });

                        $htmlAfter = array_find($widget['setting'], function($value, $key) {
                            if($value['key'] == 'html_after')
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
                                $widget['cms_widget_id'] . '-newsletter-form-widget',
                                $area,
                                (int)$widget['sort_order'],
                                get_js_file_url("production/marketing/newsletter/newsletter_form_widget.js", false),
                                [
                                    "id" => $widget['cms_widget_id'] . '-newsletter-form-widget',
                                    "name" => $widget['name'],
                                    "title" => $title,
                                    "html_before" => $htmlBefore,
                                    "html_after" => $htmlAfter,
                                    "subscribeUrl" => generate_url("newsletter.subscribe")
                                ]
                            );
                    }
                }
            });

        return $delegate;
    }
}