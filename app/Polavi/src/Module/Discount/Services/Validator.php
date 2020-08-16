<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Services;


use function Polavi\_mysql;
use function Polavi\array_find;
use function Polavi\dispatch_event;
use Polavi\Module\Checkout\Services\Cart\Cart;

class Validator
{
    /**@var callable[] */
    protected $validators = [];

    protected $requiredProducts = null;

    protected $targetProducts = null;

    public function __construct()
    {
        $this->defaultValidator();
    }

    /**
     * @param $id
     * @param callable $callable. This callable will be executed every time we validate a coupon.
     * It will receive 2 arguments are Cart object and and array of coupon data.
     * @return $this
     */
    public function addValidator($id, callable $callable)
    {
        $this->validators[$id] = $callable;

        return $this;
    }

    /**
     * @param $id
     * @return $this
     */
    public function removeValidator($id)
    {
        unset($this->validators[$id]);

        return $this;
    }

    /**
     * @param Cart $cart
     * @return float|int
     */
    protected function getCartTotalBeforeDiscount(Cart $cart) {
        $total = 0;
        foreach ($cart->getItems() as $item)
            $total += $item->getData('final_price') * $item->getData('qty');

        return $total;
    }

    /**
     * This method registers list of default coupon validators.
     */
    protected function defaultValidator()
    {
        $this->addValidator('general', function($coupon) {
            if ($coupon['status'] == '0')
                return false;
            if (floatval($coupon['discount_amount']) <= 0 && $coupon['discount_type'] !== "buy_x_get_y")
                return false;
            if (
                ($coupon['start_date'] and $coupon['start_date'] > date("Y-m-d H:i:s")) ||
                ($coupon['end_date'] and $coupon['end_date'] < date("Y-m-d H:i:s"))
            )
                return false;

            return true;
        })->addValidator('timeUsed', function($coupon, Cart $cart) {
            if (
                $coupon['max_uses_time_per_coupon']
                and (int)$coupon['used_time'] >= (int)$coupon['max_uses_time_per_coupon']
            )
                return false;
            if (
                isset($coupon['max_uses_time_per_customer'])
                and $coupon['max_uses_time_per_customer']
            ) {
                $customerId = $cart->getData('customer_id');
                if ($customerId) {
                    $flag = _mysql()->getTable('customer_coupon_use')
                        ->where('customer_id', '=', $customerId)
                        ->andWhere('coupon', '=', $coupon['coupon'])
                        ->andWhere('used_time', '>=', (int)$coupon['max_uses_time_per_customer'])
                        ->fetchOneAssoc();
                    if ($flag)
                        return false;
                }
            }

            return true;
        })->addValidator('customerGroup', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['condition'], true);
            if (
                !empty($conditions['customer_group'])
                and !in_array(0, $conditions['customer_group'])
            ) {
                $customerGroupId = $cart->getData('customer_group_id');
                if (!in_array($customerGroupId, $conditions['customer_group']))
                    return false;
            }

            return true;
        })->addValidator('subTotal', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['condition'], true);
            $minimumSubTotal = isset($conditions['order_total']) ? floatval($conditions['order_total']) : null;
            if ($minimumSubTotal and floatval($this->getCartTotalBeforeDiscount($cart)) < $minimumSubTotal)
                return false;

            return true;
        })->addValidator('minimumQty', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['condition'], true);
            $minimumQty = isset($conditions['order_qty']) ? (int)$conditions['order_qty'] : null;
            if ($minimumQty and $cart->getData('total_qty') < $minimumQty)
                return false;

            return true;
        })->addValidator('requiredProductByCategory', function($coupon, Cart $cart) {
            $requiredProducts = json_decode(trim($coupon['condition']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $requiredProducts = empty($requiredProducts) ? [] : $requiredProducts["required_product"] ?? [];
            if (!$requiredProducts) {
                return true;
            }
            foreach ($requiredProducts as $condition) {
                if ($condition['key'] == 'category') {
                    $requiredItems = [];
                    $requiredQty = (int) $condition['qty'] ?? 1;
                    $conn = _mysql();
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product_category')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('category_id', "IN", $value)
                                ->groupBy('product_id')
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product_category')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('category_id', "IN", [$value])
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            if ($condition['operator'] == "<>")
                                $check = $conn->getTable('product_category')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('category_id', "=", $value)
                                    ->fetchAllAssoc();
                            else
                                $check = $conn->getTable('product_category')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('category_id', $condition['operator'], $value)
                                    ->fetchAllAssoc();
                            if ($condition['operator'] != "<>" && $check){
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                            if (($condition['operator'] == "<>" && count($check) < count($pIDs))) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                        }
                    }
                    if ($this->requiredProducts == null) {
                        $this->requiredProducts = $requiredItems;
                    } else {
                        $this->requiredProducts = array_intersect_key($this->requiredProducts, $requiredItems);
                    }
                }
            }

            if (!$this->requiredProducts)
                return false;
            else
                return true;
        })->addValidator('requiredProductByAttributeGroup', function($coupon, Cart $cart) {
            $requiredProducts = json_decode(trim($coupon['condition']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $requiredProducts = empty($requiredProducts) ? [] : $requiredProducts["required_product"] ?? [];
            if (!$requiredProducts) {
                return true;
            }
            foreach ($requiredProducts as $condition) {
                if ($condition['key'] == 'attribute_group') {
                    $requiredItems = [];
                    $requiredQty = (int) $condition['qty'] ?? 1;
                    $conn = _mysql();
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('group_id', "IN", $value)
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('group_id', "IN", [$value])
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            if ($condition['operator'] == "<>")
                                $check = $conn->getTable('product')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('group_id', "=", $value)
                                    ->fetchAllAssoc();
                            else
                                $check = $conn->getTable('product')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('group_id', $condition['operator'], $value)
                                    ->fetchAllAssoc();
                            if ($condition['operator'] != "<>" && $check){
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                            if (($condition['operator'] == "<>" && count($check) < count($pIDs))) {
                                foreach ($items as $item) {
                                    if ($item->getData("qty") < $requiredQty)
                                        continue;
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $requiredItems[$item->getId()] = $item;
                                }
                            }
                        }
                    }
                    if ($this->requiredProducts == null) {
                        $this->requiredProducts = $requiredItems;
                    } else {
                        $this->requiredProducts = array_intersect_key($this->requiredProducts, $requiredItems);
                    }
                }
            }

            if (!$this->requiredProducts)
                return false;
            else
                return true;
        })->addValidator('requiredProductByPrice', function($coupon, Cart $cart) {
            $requiredProducts = json_decode(trim($coupon['condition']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $requiredProducts = empty($requiredProducts) ? [] : $requiredProducts["required_product"] ?? [];
            if (!$requiredProducts) {
                return true;
            }
            foreach ($requiredProducts as $condition) {
                if ($condition['key'] == 'price') {
                    $requiredItems = [];
                    $requiredQty = (int) $condition['qty'] ?? 1;
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($item->getData("qty") < $requiredQty)
                                    continue;
                                if ($condition['operator'] == "IN") {
                                    if (in_array($item->getData('final_price'), $value)) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if (!in_array($item->getData('final_price'), $value)) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($item->getData("qty") < $requiredQty)
                                    continue;
                                if ($condition['operator'] == "IN") {
                                    if ($item->getData('final_price') == $value) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if ($item->getData('final_price') != $value) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($item->getData("qty") < $requiredQty)
                                    continue;
                                switch ($condition['operator'])
                                {
                                    case "=":
                                        if ($item->getData('final_price') == $value) {
                                            $requiredItems[$item->getId()] = $item;
                                        }
                                        break;
                                    case "<":
                                        if ($item->getData('final_price') < $value) {
                                            $requiredItems[$item->getId()] = $item;
                                        }
                                        break;
                                    case "<=":
                                        if ($item->getData('final_price') <= $value) {
                                            $requiredItems[$item->getId()] = $item;
                                        }
                                        break;
                                    case ">":
                                        if ($item->getData('final_price') > $value) {
                                            $requiredItems[$item->getId()] = $item;
                                        }
                                        break;
                                    case ">=":
                                        if ($item->getData('final_price') >= $value) {
                                            $requiredItems[$item->getId()] = $item;
                                        }
                                        break;
                                    case "<>":
                                        if ($item->getData('final_price') != $value) {
                                            $requiredItems[$item->getId()] = $item;
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    if ($this->requiredProducts == null) {
                        $this->requiredProducts = $requiredItems;
                    } else {
                        $this->requiredProducts = array_intersect_key($this->requiredProducts, $requiredItems);
                    }
                }
            }

            if (!$this->requiredProducts)
                return false;
            else
                return true;
        })->addValidator('requiredProductBySKU', function($coupon, Cart $cart) {
            $requiredProducts = json_decode(trim($coupon['condition']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $requiredProducts = empty($requiredProducts) ? [] : $requiredProducts["required_product"] ?? [];
            if (!$requiredProducts) {
                return true;
            }
            foreach ($requiredProducts as $condition) {
                if ($condition['key'] == 'sku') {
                    $requiredItems = [];
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($condition['operator'] == "IN") {
                                    if (in_array($item->getData('product_sku'), $value)) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if (!in_array($item->getData('product_sku'), $value)) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($condition['operator'] == "IN") {
                                    if ($item->getData('product_sku') == $value) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if ($item->getData('product_sku') != $value) {
                                        $requiredItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                switch ($condition['operator'])
                                {
                                    case "=":
                                        if ($item->getData('product_sku') == $value)
                                            $requiredItems[$item->getId()] = $item;
                                        break;
                                    case "<":
                                        if ($item->getData('product_sku') < $value)
                                            $requiredItems[$item->getId()] = $item;
                                        break;
                                    case "<=":
                                        if ($item->getData('product_sku') <= $value)
                                            $requiredItems[$item->getId()] = $item;
                                        break;
                                    case ">":
                                        if ($item->getData('product_sku') > $value)
                                            $requiredItems[$item->getId()] = $item;
                                        break;
                                    case ">=":
                                        if ($item->getData('product_sku') >= $value)
                                            $requiredItems[$item->getId()] = $item;
                                        break;
                                    case "<>":
                                        if ($item->getData('product_sku') != $value)
                                            $requiredItems[$item->getId()] = $item;
                                        break;
                                }
                            }
                        }
                    }
                    if ($this->requiredProducts == null) {
                        $this->requiredProducts = $requiredItems;
                    } else {
                        $this->requiredProducts = array_intersect_key($this->requiredProducts, $requiredItems);
                    }
                }
            }

            if (!$this->requiredProducts)
                return false;
            else
                return true;
        })->addValidator('targetProductByCategory', function($coupon, Cart $cart) {
            if (!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"] ?? [];

            foreach ($targetProducts as $condition) {
                if ($condition['key'] == 'category') {
                    $targetItems = [];
                    $conn = _mysql();
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product_category')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('category_id', "IN", $value)
                                ->groupBy('product_id')
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item)
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item)
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product_category')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('category_id', "IN", [$value])
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item)
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item)
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            if ($condition['operator'] == "<>")
                                $check = $conn->getTable('product_category')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('category_id', "=", $value)
                                    ->fetchAllAssoc();
                            else
                                $check = $conn->getTable('product_category')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('category_id', $condition['operator'], $value)
                                    ->fetchAllAssoc();
                            if ($condition['operator'] != "<>" && $check){
                                foreach ($items as $item)
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                            if (($condition['operator'] == "<>" && count($check) < count($pIDs))) {
                                foreach ($items as $item)
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                        }
                    }
                    if ($this->targetProducts == null) {
                        $this->targetProducts = $targetItems;
                    } else {
                        $this->targetProducts = array_intersect_key($this->targetProducts, $targetItems);
                    }
                }
            }

            if (!$this->targetProducts)
                return false;
            else
                return true;
        })->addValidator('targetProductByAttributeGroup', function($coupon, Cart $cart) {
            if (!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"] ?? [];
            foreach ($targetProducts as $condition) {
                if ($condition['key'] == 'attribute_group') {
                    $targetItems = [];
                    $conn = _mysql();
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('group_id', "IN", $value)
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item)
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item)
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            $check = $conn->getTable('product')
                                ->where('product_id', 'IN', $pIDs)
                                ->andWhere('group_id', "IN", [$value])
                                ->fetchAllAssoc();
                            if (($condition['operator'] == "IN" && $check )) {
                                foreach ($items as $item)
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                            if (($condition['operator'] == "NOT IN" && count($check) < count($pIDs))) {
                                foreach ($items as $item)
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                        } else {
                            $items = $cart->getItems();
                            $pIDs = [];
                            foreach ($items as $item) {
                                $pIDs[$item->getData("product_id")] = $item->getData("product_id");
                            }
                            if ($condition['operator'] == "<>")
                                $check = $conn->getTable('product')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('group_id', "=", $value)
                                    ->fetchAllAssoc();
                            else
                                $check = $conn->getTable('product')
                                    ->where('product_id', 'IN', $pIDs)
                                    ->andWhere('group_id', $condition['operator'], $value)
                                    ->fetchAllAssoc();
                            if ($condition['operator'] != "<>" && $check){
                                foreach ($items as $item)
                                    if (array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                            if (($condition['operator'] == "<>" && count($check) < count($pIDs))) {
                                foreach ($items as $item)
                                    if (!array_find($check, function($v) use($item) {
                                        if ($item->getData("product_id") == $v["product_id"])
                                            return $item;
                                        return null;
                                    }))
                                        $targetItems[$item->getId()] = $item;
                            }
                        }
                    }
                    if ($this->targetProducts == null) {
                        $this->targetProducts = $targetItems;
                    } else {
                        $this->targetProducts = array_intersect_key($this->targetProducts, $targetItems);
                    }
                }
            }

            if (!$this->targetProducts)
                return false;
            else
                return true;
        })->addValidator('targetProductByPrice', function($coupon, Cart $cart) {
            if (!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"] ?? [];
            foreach ($targetProducts as $condition) {
                if ($condition['key'] == 'price') {
                    $targetItems = [];
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($condition['operator'] == "IN") {
                                    if (in_array($item->getData('final_price'), $value)) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if (!in_array($item->getData('final_price'), $value)) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($condition['operator'] == "IN") {
                                    if ($item->getData('final_price') == $value) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if ($item->getData('final_price') != $value) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                switch ($condition['operator'])
                                {
                                    case "=":
                                        if ($item->getData('final_price') == $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case "<":
                                        if ($item->getData('final_price') < $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case "<=":
                                        if ($item->getData('final_price') <= $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case ">":
                                        if ($item->getData('final_price') > $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case ">=":
                                        if ($item->getData('final_price') >= $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case "<>":
                                        if ($item->getData('final_price') != $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                }
                            }
                        }
                    }
                    if ($this->targetProducts == null) {
                        $this->targetProducts = $targetItems;
                    } else {
                        $this->targetProducts = array_intersect_key($this->targetProducts, $targetItems);
                    }
                }
            }

            if (!$this->targetProducts)
                return false;
            else
                return true;
        })->addValidator('targetProductBySKU', function($coupon, Cart $cart) {
            if (!in_array($coupon['discount_type'], ["fixed_discount_to_specific_products", "percentage_discount_to_specific_products"]))
                return true;

            $targetProducts = json_decode(trim($coupon['target_products']), true);
            if (JSON_ERROR_NONE !== json_last_error())
                return false;

            $targetProducts = empty($targetProducts) ? [] : $targetProducts["products"] ?? [];
            foreach ($targetProducts as $condition) {
                if ($condition['key'] == 'sku') {
                    $targetItems = [];
                    $value = $this->parseValue($condition['value']);
                    if (is_array($value)) {
                        if ($condition['operator'] != "IN" and $condition['operator'] != "NOT IN") {
                            return false;
                            break;
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($condition['operator'] == "IN") {
                                    if (in_array($item->getData('product_sku'), $value)) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if (!in_array($item->getData('product_sku'), $value)) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        if ($condition['operator'] == "IN" or $condition['operator'] == "NOT IN") {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                if ($condition['operator'] == "IN") {
                                    if ($item->getData('product_sku') == $value) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                } else {
                                    if ($item->getData('product_sku') != $value) {
                                        $targetItems[$item->getId()] = $item;
                                        break;
                                    }
                                }
                            }
                        } else {
                            $items = $cart->getItems();
                            foreach ($items as $item) {
                                switch ($condition['operator'])
                                {
                                    case "=":
                                        if ($item->getData('product_sku') == $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case "<":
                                        if ($item->getData('product_sku') < $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case "<=":
                                        if ($item->getData('product_sku') <= $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case ">":
                                        if ($item->getData('product_sku') > $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case ">=":
                                        if ($item->getData('product_sku') >= $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                    case "<>":
                                        if ($item->getData('product_sku') != $value)
                                            $targetItems[$item->getId()] = $item;
                                        break;
                                }
                            }
                        }
                    }
                    if ($this->targetProducts == null) {
                        $this->targetProducts = $targetItems;
                    } else {
                        $this->targetProducts = array_intersect_key($this->targetProducts, $targetItems);
                    }
                }
            }

            if (!$this->targetProducts)
                return false;
            else
                return true;
        });

        // Customer condition validators
        $this->addValidator('customerGroup', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['user_condition'], true);
            if (!isset($conditions['group']) || $conditions['group'] == 999)
                return true;
            if ($cart->getData('customer_group_id') != $conditions['group'])
                return false;
            return true;
        });

        $this->addValidator('customerEmail', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['user_condition'], true);
            if (!isset($conditions['email']) || trim((string)($conditions['email'])) == '')
                return true;
            $emails = str_getcsv($conditions['email']);
            if (!in_array($cart->getData('customer_email'),  $emails) || $cart->getData('customer_id') == null)
                return false;
            return true;
        });

        $this->addValidator('customerPurchasedAmount', function($coupon, Cart $cart) {
            $conditions = json_decode($coupon['user_condition'], true);
            if (!isset($conditions['purchased']) || trim((string)($conditions['purchased'])) == '')
                return true;
            $amount = floatval($conditions['purchased']);
            $conn = _mysql();
            $total = $conn->getTable('order')
                ->addFieldToSelect('SUM(grand_total)', 'total')
                ->where('customer_id','=', $cart->getData('customer_id'))
                ->andWhere('payment_status', '=', 'paid')
                ->fetchOneAssoc();
            if ($total['total'] < $amount)
                return false;
            return true;
        });
        dispatch_event('register_coupon_validator', [$this]);
    }


    /**
     * @param $value
     * @return array|string|null
     */
    protected function parseValue($value) {
        if (is_int($value) or is_float($value))
            return $value;
        $value = trim($value);
        if (!$value)
            return null;
        $arr = str_getcsv($value);
        if (count($arr) == 1)
            return $arr[0];
        return $arr;
    }

    /**
     * @param $coupon
     * @param Cart $cart
     * @return bool
     */
    public function validate($coupon, Cart $cart)
    {
        $this->targetProducts = null;
        $this->requiredProducts = null;
        $flag = true;
        foreach ($this->validators as $key=>$validator) {
            if (!$validator($coupon, $cart)) {
                $flag = false;
                break;
            }
        }

        return $flag;
    }

    /**
     * @return array
     */
    public function getTargetProducts(): array
    {
        return $this->targetProducts;
    }
}