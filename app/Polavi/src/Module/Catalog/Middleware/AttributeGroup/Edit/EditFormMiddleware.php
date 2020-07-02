<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\AttributeGroup\Edit;

use function Polavi\create_mutable_var;
use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class EditFormMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // Loading data by using GraphQL
        if($request->attributes->get('_matched_route') == 'attribute.group.edit')
            $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query" => create_mutable_var("attribute_group_edit_query", "{
                    attributeGroup(id: {$request->attributes->get('id')})
                    {
                        attribute_group_id
                        group_name
                        attributes {
                            attribute_id
                        }
                    }
                }")
            ])
            ->then(function($result) use ($response, $request) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['attributeGroup'])) {
                    $response->addWidget(
                        'attribute_group_edit',
                        'content',
                        10,
                        get_js_file_url("production/catalog/attribute_group/edit/attribute_group_edit_form.js", true),
                        [
                            "group" => $result->data['attributeGroup'],
                            "action" => generate_url('attribute.group.save', ['id'=>$request->attributes->getInt('id', null)]),
                            "listUrl" => generate_url('attribute.group.grid'),
                            "cancelUrl" => $request->attributes->get('id') ? generate_url('attribute.group.edit', ['id' => $request->attributes->get('id')]) : generate_url('attribute.group.create')
                        ]
                    );
                }
            });
        else
            $response->addWidget(
                'attribute_group_edit',
                'content',
                10,
                get_js_file_url("production/catalog/attribute_group/edit/attribute_group_edit_form.js", true),
                [
                    "action" => generate_url('attribute.group.save'),
                    "listUrl" => generate_url('attribute.group.grid'),
                    "cancelUrl" => $request->attributes->get('id') ? generate_url('attribute.group.edit', ['id' => $request->attributes->get('id')]) : generate_url('attribute.group.create')
                ]
            );

        // LOAD ATTRIBUTES
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> <<< QUERY
                    {
                        attributeCollection {
                            attributes {
                                attribute_id
                                attribute_name
                            }
                        }
                    }
QUERY
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['attributeCollection'])) {
                    $widget = $response->getWidget("attribute_group_edit", "content");
                    if(!$widget)
                        return;

                    $widget['props']['attributes'] = $result->data['attributeCollection']['attributes'];

                    $response->addWidget(
                        'attribute_group_edit',
                        'content',
                        10,
                        get_js_file_url("production/catalog/attribute_group/edit/attribute_group_edit_form.js", true),
                        $widget['props']
                    );
                }
            });

        return $delegate;
    }
}