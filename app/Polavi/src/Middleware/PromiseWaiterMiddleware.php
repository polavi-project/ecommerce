<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;

use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\PromiseWaiter;

class PromiseWaiterMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()->get(PromiseWaiter::class)->wait();

        return $delegate;
    }
}