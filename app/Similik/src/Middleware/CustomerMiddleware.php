<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\User\Customer;
use Similik\Services\Sale\TaxCalculator;

class CustomerMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        if(the_app()->getContainerScope()=='admin')
            return $next($request, $response, $delegate);
        $app[Customer::class] = function() {
            return new Customer(the_app());
        };
        /* Assign customer to tax calculator */
        TaxCalculator::setCustomer($app[Customer::class]);
        $app->get(Request::class)->setCustomer($app[Customer::class]);

        return $next($request, $response, $delegate);
    }
}