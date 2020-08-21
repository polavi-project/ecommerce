<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Attribute\Edit;

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
        if ($request->attributes->get('_matched_route') == 'attribute.edit') {
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=> create_mutable_var("attribute_edit_query", "{attribute(id: {$request->attributes->get('id')})
                    {
                        attribute_id
                        attribute_code
                        attribute_name
                        type
                        is_required
                        display_on_frontend
                        is_filterable
                        sort_order
                        options {
                            attribute_option_id
                            option_text
                        }
                    }
                }")
                ])
                ->then(function ($result) use ($response, $request) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if (isset($result->data['attribute'])) {
                        $response->addWidget(
                            'attribute_edit',
                            'content',
                            10,
                            get_js_file_url("production/catalog/attribute/edit/attribute_edit_form.js", true),
                            [
                                "attribute" => $result->data['attribute'],
                                "action" => generate_url(
                                    'attribute.save',
                                    ['id'=>$request->attributes->getInt('id', null)]
                                ),
                                "listUrl" => generate_url('attribute.grid'),
                                "cancelUrl" => $request->attributes->get('id')
                                    ? generate_url(
                                        'attribute.edit',
                                        ['id' => $request->attributes->get('id')]
                                    )
                                    : generate_url('attribute.create')
                            ]
                        );
                    }
                });
        } else {
            $response->addWidget(
                'attribute_create',
                'content',
                10,
                get_js_file_url("production/catalog/attribute/edit/attribute_edit_form.js", true),
                [
                    "action" => generate_url('attribute.save'),
                    "listUrl" => generate_url('attribute.grid'),
                    "cancelUrl" => $request->attributes->get('id')
                        ? generate_url(
                            'attribute.edit',
                            ['id' => $request->attributes->get('id')]
                        )
                        : generate_url('attribute.create')
                ]
            );
        }
        return $delegate;
    }
}