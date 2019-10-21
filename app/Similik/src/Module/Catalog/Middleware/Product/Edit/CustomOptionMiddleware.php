<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Edit;

use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class CustomOptionMiddleware extends MiddlewareAbstract
{
    const FORM_ID = 'product-edit-form';

    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('product_edit_custom_options'))
            return $delegate;
        $props = ['formId'=> self::FORM_ID, 'options' => []];
        if($request->attributes->get('_matched_route') == 'product.edit')
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=> <<< QUERY
                        {
                            customOptions : product (id: {$request->get('id', 0)} language: {$request->get('language', get_default_language_Id())}) {
                                options {
                                    option_id : product_custom_option_id
                                    option_name
                                    option_type
                                    is_required
                                    sort_order
                                    values {
                                        value_id : product_custom_option_value_id
                                        option_id
                                        extra_price
                                        value
                                        sort_order
                                    }
                                }
                            }
                        }
QUERY
                ])
                ->then(function($result) use (&$props, $response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if (isset($result->data['customOptions'])) {
                        $props['options'] = $result->data['customOptions']['options'];
                    }
                    $response->addWidget(
                        'product_edit_custom_options',
                        'admin_product_edit_inner_right',
                        20,
                        get_js_file_url("production/catalog/product/edit/option.js", true),
                        $props
                    );
                });
        else
            $response->addWidget(
                'product_edit_custom_options',
                'admin_product_edit_inner_right',
                20,
                get_js_file_url("production/catalog/product/edit/option.js", true),
                $props
            );
        return $delegate;
    }
}
