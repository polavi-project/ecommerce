<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Edit;

use function Similik\dispatch_event;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class GeneralInfoMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('product_edit_general_group'))
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                        taxClasses {
                            value: tax_class_id
                            text: name
                        }
                    }"
            ])->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['taxClasses'])) {
                    $response->addWidget(
                        'tax_class',
                        'product-edit-general',
                        55,
                        get_js_file_url("production/form/fields/select.js", true),
                        ["id" => "tax_class", 'formId'=> "product-edit-form","name"=> "tax_class", "type"=> "select", "label"=> "Tax class", "isTranslateAble"=>false, 'options'=>$result->data['taxClasses']]
                    );
                }
                return $result;
            });

//        // Loading data by using GraphQL
        if($request->attributes->get('_matched_route') == 'product.edit')
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=>"{
                        general_info: product(id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())})
                        {
                            name
                            price
                            short_description
                            description
                            sku
                            weight
                            status
                            manage_stock
                            tax_class
                            qty
                            stock_availability
                        }
                    }"
                ])->then(function($result) use (&$fields, $response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if(isset($result->data['general_info'])) {
                        $response->addWidget(
                            'product_edit_general',
                            'admin_product_edit_inner',
                            10,
                            get_js_file_url("production/catalog/product/edit/general.js", true),
                            ["id"=>"product_edit_general", "data" => $result->data['general_info']]
                        );
                    }
                });
        else
            $response->addWidget(
                'product_edit_general',
                'admin_product_edit_inner',
                10,
                get_js_file_url("production/catalog/product/edit/general.js", true),
                ["id"=>"product_edit_general"]
            );

        return $delegate;
    }
}
