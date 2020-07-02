<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\View;

use function Polavi\_mysql;
use function Polavi\get_default_language_Id;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;


class VariantMiddleware extends MiddlewareAbstract
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

        $product = $this->getDelegate(InitMiddleware::class);
        if(!$product)
            return $delegate;

        if($product["status"] == 0 && $product["variant_group_id"] == null) {
            $response->setStatusCode(404);
            $request->attributes->set('_matched_route', 'not.found');
            return $delegate;
        } else if($product["status"] == 1 && $product["variant_group_id"] == null) {
            return $delegate;
        } else {
            $availableVariants = _mysql()->getTable("product")
                ->where("variant_group_id", "=", $product["variant_group_id"])
                ->andWhere("status", "=", 1)
                ->fetchAllAssoc();
            if(!$availableVariants) {
                $response->setStatusCode(404);
                $request->attributes->set('_matched_route', 'not.found');
                return $delegate;
            }

            $promise = $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=>"{
                    variants: product(id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())})
                    {
                        name
                        variant_group_id
                        price
                        sku
                        variants {
                            sku
                            qty
                            stock_availability
                            manage_stock
                            attributes {
                                attribute_id
                                attribute_code
                                option_id
                                value_text: attribute_value_text
                            }
                        }
                    }
                }"
                ]);

            $promise->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['variants']) and $result->data['variants']) {
                    $conn = _mysql();
                    $group = $conn->getTable("variant_group")->load($result->data["variants"]["variant_group_id"]);
                    $attrIds = array_filter([
                        $group["attribute_one"],
                        $group["attribute_two"],
                        $group["attribute_three"],
                        $group["attribute_four"],
                        $group["attribute_five"],
                    ], function($a) {
                        return $a != null;
                    });
                    $attributes = $conn->getTable("attribute")->where("attribute_id", "IN", $attrIds)->fetchAllAssoc();
                    $response->addWidget(
                        'product_view_variants',
                        'product_single_page_form',
                        5,
                        get_js_file_url("production/catalog/product/view/variants.js", false),
                        [
                            "variants" => $result->data["variants"]["variants"],
                            "attributes" => $attributes
                        ]
                    );
                }
            });

            return $delegate;
        }
    }
}