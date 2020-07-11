<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Update;


use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Order\Services\OrderUpdatePromise;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\PromiseWaiter;

class InitPromiseMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $this->getContainer()->get(PromiseWaiter::class)->addPromise(
                'orderUpdate',
                new OrderUpdatePromise($request->attributes->getInt('id'))
            );
        } catch (\Exception $e) {
            $response->setStatusCode(404);
            return $response;
        }

        return $delegate;
    }
}