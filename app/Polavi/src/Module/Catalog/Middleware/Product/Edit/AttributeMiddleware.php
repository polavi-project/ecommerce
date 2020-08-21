<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\Edit;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class AttributeMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($response->hasWidget('product_edit_attributes')) {
            return $delegate;
        }

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> <<< QUERY
                    {
                        attributeGroupCollection {
                            groups {
                                attribute_group_id
                                group_name
                                attributes {
                                    attribute_id
                                    attribute_code
                                    attribute_name
                                    type
                                    is_required
                                    display_on_frontend
                                    sort_order
                                    options {
                                        option_id: attribute_option_id
                                        option_text
                                    }
                                }
                            }
                        }
                    }
QUERY

            ])
            ->then(function ($result) use ($response) {
                $props = ['attributeGroups' => []];
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (!$result->errors) {
                    if (isset($result->data['attributeGroupCollection'])) {
                        $props['attributeGroups'] = $result->data['attributeGroupCollection']['groups'];
                    }
                    $response->addWidget(
                        'product_edit_attributes',
                        'admin_product_edit_inner_right',
                        10,
                        get_js_file_url("production/catalog/product/edit/attribute.js", true),
                        $props
                    );
                }
            });

        if ($request->attributes->get('_matched_route') == 'product.edit') {
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=> <<< QUERY
                    {
                        productAttributeIndex (product_id: {$request->get('id', 0)}) {
                            attribute_id
                            option_id
                            attribute_value_text
                        }
                        selected_group : product (id: {$request->get('id', 0)}) {
                            id : group_id
                        }
                    }
QUERY

                ])
                ->then(function ($result) use ($response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    //var_dump($result);
                    if (!$result->errors) {
                        $widget = $response->getWidget("product_edit_attributes", "admin_product_edit_inner_right");
                        if (!$widget) {
                            return;
                        }

                        if (isset($result->data['selected_group']['id']) and $result->data['selected_group']['id']) {
                            $widget['props']['selected_group'] = $result->data['selected_group']['id'];
                        }
                        if (isset($result->data['productAttributeIndex']) and $result->data['productAttributeIndex']) {
                            $widget['props']['product_attribute_index'] = $result->data['productAttributeIndex'];
                        }
                        $response->addWidget(
                            'product_edit_attributes',
                            'admin_product_edit_inner_right',
                            10,
                            get_js_file_url("production/catalog/product/edit/attribute.js", true),
                            $widget['props']
                        );
                    }
                });
        }

        return $delegate;
    }
}
