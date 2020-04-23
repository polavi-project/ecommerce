<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
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