<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\View;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Sale\TaxCalculator;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;

class PriceMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        if(!$product = $delegate->get('product_data'))
            return $next($request, $response, $delegate);
        $customer_group_id = $request->getUser() ? $request->getUser()->getGroupId() : 0;
        $tier_price = get_mysql_table('product_price')
            ->addFieldToSelect("DISTINCT(qty)", "qty")
            ->addFieldToSelect("MIN(price)", "price")
            ->addFieldToSelect("active_from")
            ->addFieldToSelect("active_to")
            ->groupBy('qty')
            ->where('product_price_product_id', '=', $request->attributes->get('id'))
            ->andWhere('customer_group_id', '=', $customer_group_id)
            ->andWhere('active_from', 'IS', null, '((')
            ->orWhere('active_from', '<', date("Y-m-d H:i:s"), null, ')')
            ->andWhere('active_to', 'IS', null, '(')
            ->orWhere('active_to', '>', date("Y-m-d H:i:s"), null, '))')
            ->fetchAllAssoc(['sort_by'=>'qty', 'sort_order'=>'ASC']);
        $sale_price = $product['price'];
        foreach ($tier_price as $key=> $price) {
            if($price['qty'] == 1 && $price['price'] < $sale_price)
                $sale_price = $price['price'];
        }
        if($sale_price < $product['price'])
            $response->addWidget(
                'product_view_original_price_' . $product['product_id'],
                'product_info_column',
                20,
                Helper::getJsFileUrl("production/catalog/product/view/price.js"),
                [
                    'id'=>'product_view_original_price_' . $product['product_id'],
                    'price'=>$product['price'],
                    'class_name'=>'strikethrough'
                ]
            );
        $tax_calculator = new TaxCalculator();
        $price = $tax_calculator->getTaxedPrice($sale_price, $product['tax_class']);
        if(get_config('catalog_price_display', 0) == 0 || get_config('catalog_price_display', 0) == 2)
            $response->addWidget(
                'product_view_price_' . $product['product_id'],
                'product_info_column',
                30,
                Helper::getJsFileUrl("production/catalog/product/view/price_excl_tax.js"),
                [
                    'id'=>'product_view_org_price_' . $product['product_id'],
                    'price_excl_tax'=>$price['price_excl_tax']
                ]
            );
        if(get_config('catalog_price_display', 0) == 1 || get_config('catalog_price_display', 0) == 2)
            $response->addWidget(
                'product_view_price_' . $product['product_id'],
                'product_info_column',
                30,
                Helper::getJsFileUrl("production/catalog/product/view/price_incl_tax.js"),
                [
                    'id'=>'product_view_org_price_' . $product['product_id'],
                    'price_incl_tax'=>$price['price_incl_tax']
                ]
            );
        if($tier_price)
            $response->addWidget(
                'product_view_tier_price_' . $product['product_id'],
                'product_info_column',
                40,
                Helper::getJsFileUrl("production/catalog/product/view/tier_price.js"),
                [
                    'id'=>'product_view_tier_price_' . $product['product_id'],
                    'prices'=>$tier_price
                ]
            );
        return $next($request, $response, $delegate);
    }
}