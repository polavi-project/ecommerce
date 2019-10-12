<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Register;


use GuzzleHttp\Promise\Promise;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class RedirectMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, Promise $promise = null)
    {
        $promise->then(function($value) use ($request, $response) {
            if($request->isAdmin())
                $response->redirect($this->getContainer()->get(Router::class)->generateUrl('customer.grid'));
            else
                $response->redirect($this->getContainer()->get(Router::class)->generateUrl('homepage'));
        });

        return $promise;
    }
}