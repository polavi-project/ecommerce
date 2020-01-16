<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Services;


use function Similik\_mysql;
use function Similik\dispatch_event;
use function Similik\flatten_array;
use function Similik\get_config;
use Similik\Module\Checkout\Services\Cart\Cart;

class CouponHelper
{
    /**@var callable[] */
    private $validators = [];

    /**@var callable[] */
    private $discountCalculators = [];

    protected $discounts = [];

    protected $coupon;

    public function __construct()
    {
        $this->defaultValidator();
        $this->defaultDiscountCalculator();
    }

    protected function getCartTotalBeforeDiscount(Cart $cart) {
        $total = 0;
        foreach ($cart->getItems() as $item)
            $total += $item->getData('final_price') * $item->getData('qty');

        return $total;
    }

    protected function defaultDiscountCalculator()
    {
        $this->addDiscountCalculator('percentage_discount_to_entire_order', function($coupon, Cart $cart) {
            $coupon = _mysql()->getTable('coupon')->loadByField('coupon', $coupon);
            $discountPercent = floatval($coupon['discount_amount']) > 100 ? 100 : floatval($coupon['discount_amount']);
            $cartDiscountAmount = ($discountPercent * $this->getCartTotalBeforeDiscount($cart)) / 100;

            switch (get_config('sale_discount_calculation_rounding', 0)) {
                case 1:
                    $cartDiscountAmount = ceil($cartDiscountAmount);
                    break;
                case -1:
                    $cartDiscountAmount = floor($cartDiscountAmount);
                    break;
            }
            $i = 0;
            $distributedAmount = 0;
            $items = $cart->getItems();
            foreach ($items as $item) {
                $i ++;
                if($i == count($items)) {
                    $sharedDiscount = $cartDiscountAmount - $distributedAmount;
                } else {
                    $rowTotal = $item->getData('final_price') * $item->getData('qty');
                    $sharedDiscount = round($rowTotal * $cartDiscountAmount / $this->getCartTotalBeforeDiscount($cart), 0);
                }
                if(!isset($this->discounts[$item->getData('cart_item_id')]) or $this->discounts[$item->getData('cart_item_id')] != $sharedDiscount) {
                    $this->discounts[$item->getData('cart_item_id')] = $sharedDiscount;
                    $item->setData('discount_amount', $sharedDiscount);
                }

                $distributedAmount += $sharedDiscount;
            }
        });

        $this->addDiscountCalculator('fixed_discount_to_entire_order', function($coupon, Cart $cart) {
            $coupon = _mysql()->getTable('coupon')->loadByField('coupon', $coupon);
            $cartDiscountAmount = floatval($coupon['discount_amount']);
            $cartDiscountAmount = $this->getCartTotalBeforeDiscount($cart) > $cartDiscountAmount ? $cartDiscountAmount : $this->getCartTotalBeforeDiscount($cart);
            switch (get_config('sale_discount_calculation_rounding', 0)) {
                case 1:
                    $cartDiscountAmount = ceil($cartDiscountAmount);
                    break;
                case -1:
                    $cartDiscountAmount = floor($cartDiscountAmount);
                    break;
            }
            $i = 0;
            $distributedAmount = 0;
            $items = $cart->getItems();
            foreach ($items as $item) {
                $i ++;
                if($i == count($items)) {
                    $sharedDiscount = $cartDiscountAmount - $distributedAmount;
                } else {
                    $rowTotal = $item->getData('final_price') * $item->getData('qty');
                    $sharedDiscount = round($rowTotal * $cartDiscountAmount / $this->getCartTotalBeforeDiscount($cart), 0);
                }
                if(!isset($this->discounts[$item->getData('cart_item_id')]) or $this->discounts[$item->getData('cart_item_id')] != $sharedDiscount) {
                    $this->discounts[$item->getData('cart_item_id')] = $sharedDiscount;
                    $item->setData('discount_amount', $sharedDiscount);
                }

                $distributedAmount += $sharedDiscount;
            }
        });

        $this->addDiscountCalculator('fixed_discount_to_specific_products', function($coupon, Cart $cart) {
            $coupon = _mysql()->getTable('coupon')->loadByField('coupon', $coupon);
            $discountAmount = floatval($coupon['discount_amount']);
            $items = $cart->getItems();
            $targetProducts = trim($coupon['target_products']);
            $targetProducts = empty($targetProducts) ? [] : explode(',', $targetProducts);
            foreach ($items as $item) {
                $sku = $item->getData('product_sku');
                if(in_array($sku, $targetProducts)) {
                    $discountAmount = $item->getData('final_price') * $item->getData('qty') > $discountAmount ? $discountAmount : $item->getData('final_price') * $item->getData('qty');
                    switch (get_config('sale_discount_calculation_rounding', 0)) {
                        case 1:
                            $discountAmount = ceil($discountAmount);
                            break;
                        case -1:
                            $discountAmount = floor($discountAmount);
                            break;
                    }
                } else {
                    $discountAmount = 0;
                }
                if(!isset($this->discounts[$item->getData('cart_item_id')]) or $this->discounts[$item->getData('cart_item_id')] != $discountAmount) {
                    $this->discounts[$item->getData('cart_item_id')] = $discountAmount;
                    $item->setData('discount_amount', $discountAmount);
                }
            }
        });

        $this->addDiscountCalculator('percentage_discount_to_specific_products', function($coupon, Cart $cart) {
            $coupon = _mysql()->getTable('coupon')->loadByField('coupon', $coupon);
            $discountPercent = floatval($coupon['discount_amount']) > 100 ? 100 : floatval($coupon['discount_amount']);
            $items = $cart->getItems();
            $targetProducts = trim($coupon['target_products']);
            $targetProducts = empty($targetProducts) ? [] : explode(',', $targetProducts);
            foreach ($items as $item) {
                $sku = $item->getData('product_sku');
                if(in_array($sku, $targetProducts)) {
                    $discountAmount = $item->getData('final_price') * $item->getData('qty') * $discountPercent / 100;
                    switch (get_config('sale_discount_calculation_rounding', 0)) {
                        case 1:
                            $discountAmount = ceil($discountAmount);
                            break;
                        case -1:
                            $discountAmount = floor($discountAmount);
                            break;
                    }
                } else {
                    $discountAmount = 0;
                }
                if(!isset($this->discounts[$item->getData('cart_item_id')]) or $this->discounts[$item->getData('cart_item_id')] != $discountAmount) {
                    $this->discounts[$item->getData('cart_item_id')] = $discountAmount;
                    $item->setData('discount_amount', $discountAmount);
                }
            }
        });
    }

    public function addDiscountCalculator($discountType, callable $callable)
    {
        $this->discountCalculators[$discountType] = $callable;

        return $this;
    }

    public function removeDiscountCalculator($discountType)
    {
        unset($this->discountCalculators[$discountType]);

        return $this;
    }


    protected function defaultValidator()
    {
        $this->addValidator('general', function($coupon) {
            if($coupon['status'] == '0')
                return false;
            if(floatval($coupon['discount_amount']) <= 0)
                return false;
            if (
                ($coupon['start_date'] and $coupon['start_date'] > date("Y-m-d H:i:s")) ||
                ($coupon['end_date'] and $coupon['end_date'] < date("Y-m-d H:i:s"))
            )
                return false;

            return true;
        })->addValidator('timeUsed', function($coupon, Cart $cart) {
            if(
                $coupon['max_uses_time_per_coupon']
                and (int)$coupon['used_time'] >= (int)$coupon['max_uses_time_per_coupon']
            )
                return false;
            if(
                isset($coupon['max_uses_time_per_customer'])
                and $coupon['max_uses_time_per_customer']
            ) {
                $customerId = $cart->getData('customer_id');
                if($customerId) {
                    $flag = _mysql()->getTable('customer_coupon_use')
                        ->where('customer_id', '=', $customerId)
                        ->andWhere('coupon', '=', $coupon['coupon'])
                        ->andWhere('used_time', '>=', (int)$coupon['max_uses_time_per_customer'])
                        ->fetchOneAssoc();
                    if($flag)
                        return false;
                }
            }

            return true;
        })->addValidator('customerGroup', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['condition'], true);
            if(
                !empty($conditions['customer_group'])
                and !in_array(0, $conditions['customer_group'])
            ) {
                $customerGroupId = $cart->getData('customer_group_id');
                if(!in_array($customerGroupId, $conditions['customer_group']))
                    return false;
            }

            return true;
        })->addValidator('subTotal', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['condition'], true);
            $minimumSubTotal = isset($conditions['order_total']) ? floatval($conditions['order_total']) : null;
            if($minimumSubTotal and floatval($this->getCartTotalBeforeDiscount($cart)) < $minimumSubTotal)
                return false;

            return true;
        })->addValidator('requiredProduct', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['condition'], true);
            $conn = _mysql();
            $requiredProducts = null;
            if(isset($conditions['category']) and $conditions['category']  and !in_array(0, $conditions['category'])) {
                $requiredProducts = $conn->getTable('product_category')->addFieldToSelect('product_id')->where('category_id', 'IN', $conditions['category'])->fetchAllAssoc();
                if(!$requiredProducts)
                    return false;
                else
                    $requiredProducts = flatten_array($requiredProducts);
            }

            if(isset($conditions['attribute_group']) and $conditions['attribute_group'] and !in_array(0, $conditions['attribute_group'])) {
                $temp = $conn->getTable('product')->addFieldToSelect('product_id')->where('group_id', 'IN', $conditions['attribute_group'])->fetchAllAssoc();
                if(!$temp)
                    return false;
                else {
                    $temp = flatten_array($temp);
                    if(is_null($requiredProducts))
                        $requiredProducts = $temp;
                    else
                        $requiredProducts = array_intersect($requiredProducts, $temp);
                }
                if(!$requiredProducts)
                    return false;
            }
            
            if(isset($conditions['sku']) and $conditions['sku']) {
                $temp = $conn->getTable('product')->addFieldToSelect('product_id')->where('sku', 'IN', explode(',', $conditions['sku']))->fetchAllAssoc();
                if(!$temp)
                    return false;
                else {
                    if(is_null($requiredProducts))
                        $requiredProducts = $temp;
                    else
                        $requiredProducts = array_intersect($requiredProducts, $temp);
                }
                if(!$requiredProducts)
                    return false;
            }
            if(is_array($requiredProducts) and !$requiredProducts)
                return false;

            $minQty = (isset($conditions['min_quantity']) and $conditions['min_quantity']) ? (int)$conditions['min_quantity'] : 0;
            $minRowTotal = (isset($conditions['row_total']) and $conditions['row_total']) ? floatval($conditions['row_total']) : 0;
            $numberOfProduct = (isset($conditions['number_of_product']) and $conditions['number_of_product']) ? (int)$conditions['number_of_product'] : 1;
            if($requiredProducts == null) {
                $items = $cart->getItems();
                foreach ($items as $item)
                    if($item->getData('qty') < $minQty || $item->getData('final_price') * $item->getData('qty') < $minRowTotal)
                        return false;
            } else {
                $matchedProducts = $conn->getTable('cart_item')
                    ->where('product_id', 'IN', $requiredProducts)
                    ->andWhere('qty', '>=', $minQty)
                    ->andWhere('cart_id', '=', $cart->getData('cart_id'))
                    ->andWhere('total', '>=', $minRowTotal)
                    ->fetchOneAssoc();
                if($matchedProducts == false)
                    return false;
                if(count($matchedProducts) < $numberOfProduct)
                    return false;
            }

            return true;
        })->addValidator('targetProduct', function($coupon, Cart $cart) {
            if(in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"])) {
                $targetProducts = $coupon['target_products'];
                if(!$targetProducts)
                    return false;

                if($targetProducts) {
                    $targetProducts = explode(',', $targetProducts);
                    $items = $cart->getItems();
                    $flag = false;
                    foreach ($items as $item) {
                        $key = array_search($item->getData('product_sku'), $targetProducts);
                        if($key !== false)
                            $flag = true;
                    }

                    if(!$flag)
                        return false;
                }
            }

            return true;
        });

        dispatch_event('register_coupon_validator', [$this]);
    }

    public function addValidator($id, callable $callable)
    {
        $this->validators[$id] = $callable;

        return $this;
    }

    public function removeValidator($id)
    {
        unset($this->validators[$id]);

        return $this;
    }

    public function applyCoupon($coupon, Cart $cart)
    {
        if($coupon == null) {
            $this->coupon = null;
            $this->discounts = [];
            $items= $cart->getItems();
            foreach ($items as $item)
                $item->setData('discount_amount', null);

            return null;
        }

        $conn = _mysql();
        $_coupon = $conn->getTable('coupon')->loadByField('coupon', $coupon);
        if($_coupon == false)
            return false;

        foreach ($this->validators as $key=>$validator) {
            if(!$validator($_coupon, $cart)) {
                return false;
            }
        }

        $this->coupon = $_coupon;
        $this->calculateDiscount($coupon, $cart);

        return $coupon;
    }

    protected function calculateDiscount($coupon, Cart $cart)
    {
        $_coupon = _mysql()->getTable('coupon')->loadByField('coupon', $coupon);
        if(isset($this->discountCalculators[$_coupon['discount_type']]))
            $this->discountCalculators[$_coupon['discount_type']]($coupon, $cart);

        return $this;
    }

    /**
     * @return array|null
     */
    public function getCoupon()
    {
        return $this->coupon;
    }
}