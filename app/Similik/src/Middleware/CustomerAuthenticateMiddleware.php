<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function Similik\create_mutable_var;
use Similik\Module\Customer\Services\Customer;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

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