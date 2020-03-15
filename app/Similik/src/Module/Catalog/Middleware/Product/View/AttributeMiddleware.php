<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\View;

use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;


class AttributeMiddleware extends MiddlewareAbstract
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

        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    productAttributeIndex(product_id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())})
                    {
                        attribute_name
                        attribute_id
                        option_id
                        attribute_value_text
                    }
                }"
            ]);

        $promise->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['productAttributeIndex']) and $result->data['productAttributeIndex']) {
                    $response->addWidget(
                        'product_view_attribute',
                        'product_detail_tab',
                        20,
                        get_js_file_url("production/catalog/product/view/attributes.js", false),
                        [
                            "attributes"=>$result->data['productAttributeIndex']
                        ]
                    );
                }
            });

        return $delegate;
    }
}