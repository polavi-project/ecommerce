<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services;


use Similik\Module\Checkout\Services\Cart\Address;

class OrderCreator
{
    /**@var Address $shippingAddress */
    protected $shippingAddress;

    /**@var Address $billingAddress */
    protected $billingAddress;

    protected $shippingMethod;

    protected $paymentMethod;

    public function createOrder(Cart\Cart $cart)
    {

    }

    /**
     * @param Address $shippingAddress
     * @return OrderCreator
     */
    public function setShippingAddress(Address $shippingAddress): OrderCreator
    {
        $this->shippingAddress = $shippingAddress;
        return $this;
    }

    /**
     * @param Address $billingAddress
     * @return OrderCreator
     */
    public function setBillingAddress(Address $billingAddress): OrderCreator
    {
        $this->billingAddress = $billingAddress;
        return $this;
    }

    /**
     * @param mixed $shippingMethod
     * @return OrderCreator
     */
    public function setShippingMethod($shippingMethod)
    {
        $this->shippingMethod = $shippingMethod;
        return $this;
    }

    /**
     * @param mixed $paymentMethod
     * @return OrderCreator
     */
    public function setPaymentMethod($paymentMethod)
    {
        $this->paymentMethod = $paymentMethod;
        return $this;
    }
}