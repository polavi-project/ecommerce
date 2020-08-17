<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Widget\ProductFilter;


use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->attributes->get('type') != 'product_filter' && $request->attributes->get('type', null) != null)
            return $delegate;

        $id = (int) $request->attributes->get('id');
        if ($id)
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
                                sortOrder: sort_order
                            }
                        }"
                ])->then(function ($result) use (&$fields, $response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if (isset($result->data['cmsWidget'])) {
                        $response->addWidget(
                            'product_filter_widget_edit_form',
                            'widget_edit_form',
                            10,
                            get_js_file_url("production/catalog/widgets/product_filter/form.js", true),
                            array_merge($result->data['cmsWidget'], [
                                'formAction' => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api"),
                                'redirect' => $this->getContainer()->get(Router::class)->generateUrl("widget.grid")
                            ])
                        );
                    }
                });
        else
            $response->addWidget(
                'product_filter_widget_edit_form',
                'widget_edit_form',
                10,
                get_js_file_url("production/catalog/widgets/product_filter/form.js", true),
                [
                    'formAction' => $this->getContainer()->get(Router::class)->generateUrl("admin.graphql.api"),
                    'redirect' => $this->getContainer()->get(Router::class)->generateUrl("widget.grid")
                ]
            );

        return $delegate;
    }
}