<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services;


use Similik\Services\Db\Processor;

class PriceHelper
{
    /**@var Processor $processor*/
    protected $processor;

    public function __construct(Processor $processor)
    {
        $this->processor = $processor;
    }

    public function getProductSalePrice($productId, $regularPrice, $qty, $customerGroupId)
    {
        $tierPrice = $this->processor->getTable('product_price')
            ->addFieldToSelect("DISTINCT(qty)", "qty")
            ->addFieldToSelect("MIN(price)", "price")
            ->addFieldToSelect("active_from")
            ->addFieldToSelect("active_to")
            ->groupBy('qty')
            ->where('product_price_product_id', '=', $productId)
            ->andWhere('customer_group_id', '=', $customerGroupId)
            ->andWhere('active_from', 'IS', null, '((')
            ->orWhere('active_from', '<', date("Y-m-d H:i:s"), null, ')')
            ->andWhere('active_to', 'IS', null, '(')
            ->orWhere('active_to', '>', date("Y-m-d H:i:s"), null, '))')
            ->fetchAllAssoc(['sort_by'=>'qty', 'sort_order'=>'ASC']);

        if(!$tierPrice)
            return $regularPrice;
        else {
            $tmpPrice = $regularPrice;
            foreach ($tierPrice as $price)
                if($qty >= $price['qty']) {
                    $tmpPrice = $price['price'];
                }
            return $tmpPrice;
        }
    }
}