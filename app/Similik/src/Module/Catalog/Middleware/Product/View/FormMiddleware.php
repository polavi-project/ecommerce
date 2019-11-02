<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\View;

use function Similik\generate_url;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;


class FormMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->getStatusCode() == 404)
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    custom_options : product(id: {$request->attributes->get('id')} language:{$request->get('language', get_default_language_Id())})
                    {
                        options {
                            option_id: product_custom_option_id
                            option_name
                            option_type
                            is_required
                            values {
                                value_id: product_custom_option_value_id
                                extra_price
                                value
                            }
                        }
                    }
                }"
            ])
            ->then(function($result) use ($request, $response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                $options = [];
                if(isset($result->data['custom_options']) and $result->data['custom_options']) {
                    $options = $result->data['custom_options']['options'];
                }
                $response->addWidget(
                    'product_view_form',
                    'product_page_middle_right',
                    50,
                    get_js_file_url("production/catalog/product/view/form.js", false),
                    [
                        "customOptions" => $options,
                        "productId" => $request->attributes->get('id'),
                        "action" => generate_url("cart.add")
                    ]
                );
            });

        return $delegate;
    }
}