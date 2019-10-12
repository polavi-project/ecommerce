<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Module\Checkout\PaymentMethod\Cod;
use Similik\Module\Checkout\PaymentMethod\OfflinePaymentAbstract;
use Similik\Module\Checkout\PaymentMethod\OnlinePaymentAbstract;
use Similik\Module\Checkout\PaymentMethod\PaymentMethodInterface;
use Similik\Module\Checkout\ShippingMethod\FlatRate;
use Similik\Module\Checkout\ShippingMethod\FreeShipping;
use Similik\Module\Checkout\ShippingMethod\ShippingMethodInterface;
use Similik\Module\PaypalExpress\PaypalExpress;

class CheckoutMiddleware extends MiddlewareAbstract
{
    protected $shipping_methods = [];

    protected $payment_methods = [];

    public function __construct()
    {
        $this->addShippingMethod(new FreeShipping());
        $this->addShippingMethod(new FlatRate());

        $this->addPaymentMethod(new Cod());
        $this->addPaymentMethod(new PaypalExpress());
    }

    public function __invoke(Request $request, Response $response)
    {
        dispatch_event('register_shipping_method', [$this]);

        // Shipping method init
        the_app()['shipping_methods'] = $this->shipping_methods;

        // Payment method init
        the_app()['payment_methods'] = $this->payment_methods;

        return $next($request, $response, $delegate);
    }

    /**
     * @param ShippingMethodInterface $method
     * @return $this
     */
    public function addShippingMethod(ShippingMethodInterface $method)
    {
        if(preg_match('/^[A-Za-z0-9_]+$/', $method->getCode()))
            $this->shipping_methods[$method->getCode()] = $method;

        return $this;
    }

    /**
     * @param string $code
     * @return $this
     */
    public function removeShippingMethod($code)
    {
        if(isset($this->shipping_methods[$code]))
            unset($this->shipping_methods[$code]);

        return $this;
    }


    /**
     * @param PaymentMethodInterface $method
     * @return $this
     */
    public function addPaymentMethod(PaymentMethodInterface $method)
    {
        if(($method instanceof OfflinePaymentAbstract or $method instanceof OnlinePaymentAbstract) and preg_match('/^[A-Za-z0-9_]+$/', $method->getCode()))
            $this->payment_methods[$method->getCode()] = $method;

        return $this;
    }

    /**
     * @param string $code
     * @return $this
     */
    public function removePaymentMethod($code)
    {
        if(isset($this->payment_methods[$code]))
            unset($this->payment_methods[$code]);

        return $this;
    }
}