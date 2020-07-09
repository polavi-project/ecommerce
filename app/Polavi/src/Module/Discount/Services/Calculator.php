<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Services;


use function Polavi\_mysql;
use function Polavi\get_config;
use Polavi\Module\Checkout\Services\Cart\Cart;

class Calculator
{
    /**@var callable[] */
    protected $discountCalculators = [];

    protected $discounts = [];

    public function __construct()
    {
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
        $this->addDiscountCalculator('percentage_discount_to_entire_order', function(array $coupon, Cart $cart) {
            if($coupon['discount_type'] != "percentage_discount_to_entire_order")
                return false;

            $discountPercent = abs(floatval($coupon['discount_amount'])) > 100 ? 100 : abs(floatval($coupon['discount_amount']));
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
                }

                $distributedAmount += $sharedDiscount;
            }

            return true;
        });

        $this->addDiscountCalculator('fixed_discount_to_entire_order', function(array $coupon, Cart $cart) {
            if($coupon['discount_type'] != "fixed_discount_to_entire_order")
                return false;

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
                }

                $distributedAmount += $sharedDiscount;
            }

            return true;
        });

        $this->addDiscountCalculator('discount_to_specific_products_by_category', function(array $coupon, Cart $cart) {
            if(!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $items = $cart->getItems();
            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"];

            $discountItems = [];
            foreach ($targetProducts as $condition) {
                if($condition['key'] != 'category')
                    continue;
                $conn = _mysql();
                $value = $this->parseValue($condition['value']);
                if(is_array($value)) {
                    if($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                        return false;
                        break;
                    } else {
                        foreach ($items as $item) {
                            $check = $conn->getTable('product_category')
                                ->where('product_id', '=', $item->getData("product_id"))
                                ->andWhere('category_id', "IN", $value)
                                ->fetchOneAssoc();
                            if(($condition['operator'] == "IN" && $check != false) || ($condition['operator'] == "NOT IN" && $check == false))
                                $discountItems[] = $item;
                        }

                    }
                } else {
                    if($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                        foreach ($items as $item) {
                            $check = $conn->getTable('product_category')
                                ->where('product_id', '=', $item->getData("product_id"))
                                ->andWhere('category_id', "IN", $value)
                                ->fetchOneAssoc();
                            if(($condition['operator'] == "IN" && $check != false) || ($condition['operator'] == "NOT IN" && $check == false))
                                $discountItems[] = $item;
                        }
                    } else {
                        foreach ($items as $item) {
                            if($condition['operator'] == "<>")
                                $check = $conn->getTable('product_category')
                                    ->where('product_id', '=', $item->getData("product_id"))
                                    ->andWhere('category_id', "=", $value)
                                    ->fetchOneAssoc();
                            else
                                $check = $conn->getTable('product_category')
                                    ->where('product_id', '=', $item->getData("product_id"))
                                    ->andWhere('category_id', $condition["operator"], $value)
                                    ->fetchOneAssoc();
                            if(($condition['operator'] != "<>" && $check != false) || ($condition['operator'] == "<>" && $check == false))
                                $discountItems[] = $item;
                        }

                    }
                }
                $discounts = [];
                foreach ($discountItems as $i) {
                    if($coupon['discount_type'] == "fixed_discount_to_specific_products") {
                        $discountAmount = abs(floatval($coupon['discount_amount']));
                        if($discountAmount > $i->getData("total"))
                            $discountAmount = $i->getData("total");
                        $discounts[$i->getId()] = $discountAmount;
                    } else {
                        $discountPercent = floatval($coupon['discount_amount']) > 100 ? 100 : abs(floatval($coupon['discount_amount']));
                        $discountAmount = $i->getData('final_price') * $i->getData('qty') * $discountPercent / 100;
                        switch (get_config('sale_discount_calculation_rounding', 0)) {
                            case 1:
                                $discounts[$i->getId()] = ceil($discountAmount);
                                break;
                            case -1:
                                $discounts[$i->getId()] = floor($discountAmount);
                                break;
                            case 0:
                                $discounts[$i->getId()] = round($discountAmount);
                                break;
                        }
                    }
                }

                if($this->discounts)
                    $this->discounts = array_intersect_key($this->discounts, $discounts);
                else
                    $this->discounts = $discounts;
            }

            return true;
        });

        $this->addDiscountCalculator('discount_to_specific_products_by_attribute_group', function(array $coupon, Cart $cart) {
            if(!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $items = $cart->getItems();
            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"];

            $discountItems = [];
            foreach ($targetProducts as $condition) {
                if($condition['key'] != 'attribute_group')
                    continue;
                $conn = _mysql();
                $value = $this->parseValue($condition['value']);
                if(is_array($value)) {
                    if($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                        return false;
                        break;
                    } else {
                        foreach ($items as $item) {
                            $check = $conn->getTable('product')
                                ->where('product_id', '=', $item->getData("product_id"))
                                ->andWhere('group_id', "IN", $value)
                                ->fetchOneAssoc();
                            if(($condition['operator'] == "IN" && $check != false) || ($condition['operator'] == "NOT IN" && $check == false))
                                $discountItems[] = $item;
                        }

                    }
                } else {
                    if($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                        foreach ($items as $item) {
                            $check = $conn->getTable('product')
                                ->where('product_id', '=', $item->getData("product_id"))
                                ->andWhere('group_id', "IN", $value)
                                ->fetchOneAssoc();
                            if(($condition['operator'] == "IN" && $check != false) || ($condition['operator'] == "NOT IN" && $check == false))
                                $discountItems[] = $item;
                        }
                    } else {
                        foreach ($items as $item) {
                            if($condition['operator'] == "<>")
                                $check = $conn->getTable('product')
                                    ->where('product_id', '=', $item->getData("product_id"))
                                    ->andWhere('group_id', "=", $value)
                                    ->fetchOneAssoc();
                            else
                                $check = $conn->getTable('product')
                                    ->where('product_id', '=', $item->getData("product_id"))
                                    ->andWhere('group_id', $condition["operator"], $value)
                                    ->fetchOneAssoc();
                            if(($condition['operator'] != "<>" && $check != false) || ($condition['operator'] == "<>" && $check == false))
                                $discountItems[] = $item;
                        }

                    }
                }

                $discounts = [];
                foreach ($discountItems as $i) {
                    if($coupon['discount_type'] == "fixed_discount_to_specific_products") {
                        $discountAmount = abs(floatval($coupon['discount_amount']));
                        if($discountAmount > $i->getData("total"))
                            $discountAmount = $i->getData("total");
                        $discounts[$i->getId()] = $discountAmount;
                    } else {
                        $discountPercent = floatval($coupon['discount_amount']) > 100 ? 100 : abs(floatval($coupon['discount_amount']));
                        $discountAmount = $i->getData('final_price') * $i->getData('qty') * $discountPercent / 100;
                        switch (get_config('sale_discount_calculation_rounding', 0)) {
                            case 1:
                                $discounts[$i->getId()] = ceil($discountAmount);
                                break;
                            case -1:
                                $discounts[$i->getId()] = floor($discountAmount);
                                break;
                            case 0:
                                $discounts[$i->getId()] = round($discountAmount);
                                break;
                        }
                    }
                }

                if($this->discounts)
                    $this->discounts = array_intersect_key($this->discounts, $discounts);
                else
                    $this->discounts = $discounts;
            }

            return true;
        });

        $this->addDiscountCalculator('discount_to_specific_products_by_price', function(array $coupon, Cart $cart) {
            if(!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $items = $cart->getItems();
            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"];

            $discountItems = [];
            foreach ($targetProducts as $condition) {
                if($condition['key'] != 'price')
                    continue;
                $value = $this->parseValue($condition['value']);
                if(is_array($value)) {
                    if($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                        return false;
                        break;
                    } else {
                        foreach ($items as $item) {
                            if($condition['operator'] == "IN") {
                                if(in_array($item->getData('final_price'), $value)) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            } else {
                                if(!in_array($item->getData('final_price'), $value)) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                        foreach ($items as $item) {
                            if($condition['operator'] == "IN") {
                                if($item->getData('final_price') == $value) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            } else {
                                if($item->getData('final_price') != $value) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            }
                        }
                    } else {
                        foreach ($items as $item) {
                            switch($condition['operator'])
                            {
                                case "=":
                                    if($item->getData('final_price') == $value)
                                        $discountItems[] = $item;
                                    break;
                                case "<":
                                    if($item->getData('final_price') < $value)
                                        $discountItems[] = $item;
                                    break;
                                case "<=":
                                    if($item->getData('final_price') <= $value)
                                        $discountItems[] = $item;
                                    break;
                                case ">":
                                    if($item->getData('final_price') > $value)
                                        $discountItems[] = $item;
                                    break;
                                case ">=":
                                    if($item->getData('final_price') >= $value)
                                        $discountItems[] = $item;
                                    break;
                                case "<>":
                                    if($item->getData('final_price') != $value)
                                        $discountItems[] = $item;
                                    break;
                            }
                        }
                    }
                }
                $discounts = [];
                foreach ($discountItems as $i) {
                    if($coupon['discount_type'] == "fixed_discount_to_specific_products") {
                        $discountAmount = abs(floatval($coupon['discount_amount']));
                        if($discountAmount > $i->getData("total"))
                            $discountAmount = $i->getData("total");
                        $discounts[$i->getId()] = $discountAmount;
                    } else {
                        $discountPercent = floatval($coupon['discount_amount']) > 100 ? 100 : abs(floatval($coupon['discount_amount']));
                        $discountAmount = $i->getData('final_price') * $i->getData('qty') * $discountPercent / 100;
                        switch (get_config('sale_discount_calculation_rounding', 0)) {
                            case 1:
                                $discounts[$i->getId()] = ceil($discountAmount);
                                break;
                            case -1:
                                $discounts[$i->getId()] = floor($discountAmount);
                                break;
                            case 0:
                                $discounts[$i->getId()] = round($discountAmount);
                                break;
                        }
                    }
                }

                if($this->discounts)
                    $this->discounts = array_intersect_key($this->discounts, $discounts);
                else
                    $this->discounts = $discounts;
            }

            return true;
        });

        $this->addDiscountCalculator('discount_to_specific_products_by_sku', function(array $coupon, Cart $cart) {
            if(!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $items = $cart->getItems();
            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"];

            $discountItems = [];
            foreach ($targetProducts as $condition) {
                if($condition['key'] != 'sku')
                    continue;
                $value = $this->parseValue($condition['value']);
                if(is_array($value)) {
                    if($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                        return false;
                        break;
                    } else {
                        foreach ($items as $item) {
                            if($condition['operator'] == "IN") {
                                if(in_array($item->getData('product_sku'), $value)) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            } else {
                                if(!in_array($item->getData('product_sku'), $value)) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                        foreach ($items as $item) {
                            if($condition['operator'] == "IN") {
                                if($item->getData('product_sku') == $value) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            } else {
                                if($item->getData('product_sku') != $value) {
                                    $discountItems[] = $item;
                                    break;
                                }
                            }
                        }
                    } else {
                        foreach ($items as $item) {
                            switch($condition['operator'])
                            {
                                case "=":
                                    if($item->getData('product_sku') == $value)
                                        $discountItems[] = $item;
                                    break;
                                case "<":
                                    if($item->getData('product_sku') < $value)
                                        $discountItems[] = $item;
                                    break;
                                case "<=":
                                    if($item->getData('product_sku') <= $value)
                                        $discountItems[] = $item;
                                    break;
                                case ">":
                                    if($item->getData('product_sku') > $value)
                                        $discountItems[] = $item;
                                    break;
                                case ">=":
                                    if($item->getData('product_sku') >= $value)
                                        $discountItems[] = $item;
                                    break;
                                case "<>":
                                    if($item->getData('product_sku') != $value)
                                        $discountItems[] = $item;
                                    break;
                            }
                        }
                    }
                }

                $discounts = [];
                foreach ($discountItems as $i) {
                    if($coupon['discount_type'] == "fixed_discount_to_specific_products") {
                        $discountAmount = abs(floatval($coupon['discount_amount']));
                        if($discountAmount > $i->getData("total"))
                            $discountAmount = $i->getData("total");
                        $discounts[$i->getId()] = $discountAmount;
                    } else {
                        $discountPercent = floatval($coupon['discount_amount']) > 100 ? 100 : abs(floatval($coupon['discount_amount']));
                        $discountAmount = $i->getData('final_price') * $i->getData('qty') * $discountPercent / 100;
                        switch (get_config('sale_discount_calculation_rounding', 0)) {
                            case 1:
                                $discounts[$i->getId()] = ceil($discountAmount);
                                break;
                            case -1:
                                $discounts[$i->getId()] = floor($discountAmount);
                                break;
                            case 0:
                                $discounts[$i->getId()] = round($discountAmount);
                                break;
                        }
                    }
                }

                if($this->discounts)
                    $this->discounts = array_intersect_key($this->discounts, $discounts);
                else
                    $this->discounts = $discounts;
            }

            return true;
        });

        $this->addDiscountCalculator('buy_x_get_y', function(array $coupon, Cart $cart) {
            if($coupon['discount_type'] != "buy_x_get_y")
                return true;

            $configs = json_decode($coupon['buyx_gety'], true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;
            $items = $cart->getItems();
            foreach ($configs as $row) {
                $sku = $row['sku'] ?? null;
                $buyQty = isset($row['buy_qty']) ? (int) $row['buy_qty'] : null;
                $getQty = isset($row['get_qty']) ? (int) $row['get_qty'] : null;
                $maxY = isset($row['max_y']) ? (int) $row['max_y'] : 1000000;
                $discount = isset($row['discount']) ? floatval($row['discount']) : 0;

                if(!$sku || !$buyQty || !$getQty || $buyQty == null || $getQty == null || $discount < 0 || $discount > 100)
                    return;

                foreach ($items as $item) {
                    if($item->getData("product_sku") == trim($sku) && $item->getData("qty") >= $buyQty + $getQty) {
                        $discountPerUnit = $discount * $item->getData("final_price") / 100;
                        $discountAbleUnits = floor($item->getData("qty") / $buyQty) * $getQty;
                        if($discountAbleUnits < $maxY)
                            $discountAmount = $discountAbleUnits * $discountPerUnit;
                        else
                            $discountAmount = $discountPerUnit * $maxY;

                        if(!isset($this->discounts[$item->getData('cart_item_id')]) or $this->discounts[$item->getData('cart_item_id')] != $discountAmount) {
                            $this->discounts[$item->getData('cart_item_id')] = $discountAmount;
                            $item->setData('discount_amount', $discountAmount);
                        }
                    }
                }
            }
        });
    }

    public function addDiscountCalculator($id, callable $callable)
    {
        $this->discountCalculators[$id] = $callable;

        return $this;
    }

    public function removeDiscountCalculator($id)
    {
        unset($this->discountCalculators[$id]);

        return $this;
    }


    protected function parseValue($value) {
        if(is_int($value) or is_float($value))
            return $value;
        $value = trim($value);
        if(!$value)
            return null;
        $arr = str_getcsv($value);
        if(count($arr) == 1)
            return $arr[0];
        return $arr;
    }

    public function calculate(Cart $cart, array $coupon = null)
    {
        if(!$coupon) {
            $this->discounts = [];
            return [];
        }

        foreach ($this->discountCalculators as $key=>$calculator) {
            $calculator($coupon, $cart);
        }

        return $this->discounts;
    }

    public function getDiscounts()
    {
        return $this->discounts;
    }
}