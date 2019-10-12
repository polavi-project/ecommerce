<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Update;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Middleware\ResponseMiddleware;
use Similik\Module\Order\Services\OrderUpdatePromise;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use function Similik\subscribe;

class InitPromiseMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $this->getContainer()->set(OrderUpdatePromise::class, new OrderUpdatePromise($request->attributes->getInt('id')));
        } catch (\Exception $e) {
            $response->setStatusCode(404);
            return $response;
        }

        subscribe('route_middleware_ended', function() {
            $this->getContainer()->get(OrderUpdatePromise::class)->wait();
        });

        return $delegate;
    }
}