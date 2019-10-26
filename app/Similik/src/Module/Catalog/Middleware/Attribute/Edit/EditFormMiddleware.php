<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Edit;

use function Similik\generate_url;
use function Similik\get_default_language_Id;
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
        if($request->attributes->get('_matched_route') == 'attribute.edit')
            $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{attribute(id: {$request->attributes->get('id')})
                    {
                        attribute_id
                        attribute_code
                        attribute_name
                        type
                        is_required
                        display_on_frontend
                        sort_order
                        options {
                            attribute_option_id
                            option_text
                        }
                    }
                }"
            ])
            ->then(function($result) use ($response, $request) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['attribute'])) {
                    $response->addWidget(
                        'attribute_edit',
                        'content',
                        10,
                        get_js_file_url("production/catalog/attribute/edit/attribute_edit_form.js", true),
                        [
                            "attribute" => $result->data['attribute'],
                            "action" => generate_url('attribute.save', ['id'=>$request->attributes->getInt('id', null)])
                        ]
                    );
                }
            });
        else
            $response->addWidget(
                'attribute_create',
                'content',
                10,
                get_js_file_url("production/catalog/attribute/edit/attribute_edit_form.js", true),
                [
                    "action" => generate_url('attribute.save')
                ]
            );
        return $delegate;
    }
}