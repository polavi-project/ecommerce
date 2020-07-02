<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;

use function Polavi\create_mutable_var;
use Polavi\Module\Customer\Services\Customer;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class CustomerAuthenticateMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin())
            return $delegate;

        // Create customer object and let it do the authorization
        $customer = new Customer($request->getSession());
        $request->setCustomer($customer);
        $response->addState('customer', create_mutable_var("customer_state", [
            'full_name' => $request->getCustomer()->getData('full_name'),
            'email' => $request->getCustomer()->getData('email')
        ], [$customer]));

        return $delegate;
    }
}