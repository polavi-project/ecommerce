<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\View;

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
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($response->getStatusCode() == 404)
            return $delegate;

        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    productAttributeIndex(product_id: {$request->get('id')})
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
                if (isset($result->data['productAttributeIndex']) and $result->data['productAttributeIndex']) {
                    $response->addWidget(
                        'product_view_attribute',
                        'product_single_tabs',
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