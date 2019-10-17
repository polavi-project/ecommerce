<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Update;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Order\Services\OrderUpdatePromise;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\PromiseWaiter;

class InitPromiseMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $this->getContainer()->set(OrderUpdatePromise::class, new OrderUpdatePromise($request->attributes->getInt('id')));
            $this->getContainer()->get(PromiseWaiter::class)->addPromise($this->getContainer()->get(OrderUpdatePromise::class));
        } catch (\Exception $e) {
            $response->setStatusCode(404);
            return $response;
        }

        return $delegate;
    }
}