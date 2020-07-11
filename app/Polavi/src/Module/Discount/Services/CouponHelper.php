<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Services;


use function Polavi\_mysql;
use Polavi\Module\Checkout\Services\Cart\Cart;

class CouponHelper
{
    /**@var Cart $cart*/
    protected $cart;

    /**@var Validator $validator*/
    protected $validator;

    /**@var Calculator $calculator*/
    protected $calculator;

    protected $coupon;

    public function __construct(Cart $cart, Validator $validator, Calculator $calculator)
    {
        $this->cart = $cart;
        $this->validator = $validator;
        $this->calculator = $calculator;
    }

    public function applyCoupon($coupon, Cart $cart)
    {
        $flag = true;

        $conn = _mysql();
        $_coupon = $conn->getTable('coupon')->loadByField('coupon', $coupon);
        if($_coupon == false)
            $flag = false;

        if($flag == true)
            $flag = $this->validator->validate($_coupon, $this->cart);

        if($flag == false) {
            $discounts = $this->calculator->calculate($this->cart, null);
        } else {
            $this->coupon = $_coupon;
            $discounts = $this->calculator->calculate($cart, $_coupon);
        }

        if(!$discounts) {
            $items= $cart->getItems();
            foreach ($items as $item)
                $item->setData('discount_amount', 0);

            return null;
        } else {
            $items= $cart->getItems();
            foreach ($items as $item)
                if(isset($discounts[$item->getId()]))
                    $item->setData('discount_amount', $discounts[$item->getId()]);
                else
                    $item->setData('discount_amount', 0);

            return $coupon;
        }
    }

    /**
     * @return array|null
     */
    public function getCoupon()
    {
        return $this->coupon;
    }
}