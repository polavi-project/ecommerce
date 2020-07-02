<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\User\Middleware\Login;

use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class ValidateMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getUser()) {
            $response->addData('success', 1)->redirect($this->getContainer()->get(Router::class)->generateUrl('dashboard'));
            return $response;
        }
        $this->getContainer()->get(Helmet::class)->setTitle("Admin login");

        return $delegate;
    }
}