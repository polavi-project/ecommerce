<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\AttributeGroup\Edit;

use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

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
                "query"=>"{
                    attributeGroup(id: {$request->attributes->get('id')})
                    {
                        attribute_group_id
                        group_name
                        attributes {
                            attribute_id
                        }
                    }
                }"
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
                            "action" => generate_url('attribute.group.save', ['id'=>$request->attributes->getInt('id', null)])
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
                    "action" => generate_url('attribute.group.save')
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