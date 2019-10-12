<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Edit;

use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class PriceMiddleware extends MiddlewareAbstract
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
        if($response->hasWidget('product_edit_advanced_price'))
            return $delegate;
        if($request->attributes->get('_matched_route') == 'product.edit')
            $query = <<< QUERY
                    {
                        product (id: {$request->get('id')} language:1) {
                            advanced_price {
                                product_price_id
                                product_price_product_id
                                price
                                customer_group_id       
                                qty
                                active_from
                                active_to
                            }
                        }
                        customerGroups {
                            value: customer_group_id
                            text: group_name
                        }
                    }
QUERY;
        else
            $query = <<< QUERY
                    {
                        customerGroups {
                            value: customer_group_id
                            text: group_name
                        }
                    }
QUERY;
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> $query
            ])
            ->then(function($result) use ($response) {
                $advancedPrice = [];
                $customerGroups = [];
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['product'])) {
                    $advancedPrice = $result->data['product']['advanced_price'];
                }
                if (isset($result->data['customerGroups'])) {
                    $customerGroups = $result->data['customerGroups'];
                }
                $response->addWidget(
                    'product_edit_advanced_price',
                    'admin_product_edit_inner',
                    30,
                    get_js_file_url("production/catalog/product/edit/advanced_price.js", true),
                    ['formId'=> self::FORM_ID, "prices"=> $advancedPrice, 'customerGroups'=>$customerGroups]
                );
            });

        return $delegate;
    }
}
