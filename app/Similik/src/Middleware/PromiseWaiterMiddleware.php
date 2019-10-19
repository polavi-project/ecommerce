<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Log\Logger;
use Similik\Services\PromiseWaiter;

class PromiseWaiterMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()->get(PromiseWaiter::class)->wait();

        return $delegate;
    }
}