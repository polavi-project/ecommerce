<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\Edit;

use function Polavi\get_default_language_Id;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

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
                            qty
                            weight
                            status
                        }
                    }"
                ])->then(function($result) use ($response) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if(isset($result->data['general_info'])) {
                        $response->addWidget(
                            'product_edit_general',
                            'admin_product_edit_inner_left',
                            10,
                            get_js_file_url("production/catalog/product/edit/general.js", true),
                            ["id"=>"product_edit_general", "data" => $result->data['general_info']]
                        );
                        $response->addState("currentSku", $result->data['general_info']['sku']);
                        $response->addState("currentQty", $result->data['general_info']['qty']);
                        $response->addState("currentPrice", $result->data['general_info']['price']);
                    }
                });
        else
            $response->addWidget(
                'product_edit_general',
                'admin_product_edit_inner_left',
                10,
                get_js_file_url("production/catalog/product/edit/general.js", true),
                ["id"=>"product_edit_general"]
            );

        return $delegate;
    }
}
