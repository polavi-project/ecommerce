<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\View;

use function Similik\_mysql;
use function Similik\array_find;
use function Similik\get_current_language_id;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;


class VariantDetectMiddleware extends MiddlewareAbstract
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
        if($product["variant_group_id"] == null)
            return $delegate;

        $queries = $request->query->all();
        $conn = _mysql();
        $group = $conn->getTable("variant_group")->load($product["variant_group_id"]);
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
        $selectedOptions = [];
        $selectedOptionsCode = [];
        foreach ($queries as $key=>$value) {
            $a = array_find($attributes, function($a) use($key) { return $a["attribute_code"] == $key ? $a : null;});
            if($a && is_numeric($value)) {
                $selectedOptions[$a["attribute_id"]] = $value;
                $selectedOptionsCode[$key] = $value;
            }
        }

        if(!$selectedOptions) {
            if($product["status"] == 1)
                return $delegate;
            else {
                $p = $conn->getTable("product")
                    ->setFieldToSelect("product.product_id")
                    ->where("variant_group_id", "=", $product["variant_group_id"])
                    ->andWhere("status", "=", 1)
                    ->fetchOneAssoc(["sort_by" => "product.price", "sort_order"=> "ASC"]);

                $request->attributes->set("id", $p["product_id"]);

                return $delegate;
            }
        } else {
            $tmp = $conn->getTable("product")
                ->setFieldToSelect("product.product_id")
                ->leftJoin('product_attribute_value_index', null, [
                    [
                        "column"      => "product_attribute_value_index.language_id",
                        "operator"    => "=",
                        "value"       => 0,
                        "ao"          => 'and',
                        "start_group" => null,
                        "end_group"   => null
                    ]
                ])
                ->where("variant_group_id", "=", $product["variant_group_id"])
                ->andWhere("status", "=", 1);
            foreach ($selectedOptions as $key=>$val)
                $tmp->andWhere("product_attribute_value_index.attribute_id", "=", $key)
                    ->andWhere("product_attribute_value_index.option_id", "=", $val);

            $p = $tmp->fetchOneAssoc();
            if(!$p) {
                return $delegate;
            } else {
                $request->attributes->set("id", $p["product_id"]);
                $response->addState("variantFilters", $selectedOptionsCode);
                return $delegate;
            }
        }
    }
}