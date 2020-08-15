<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\User\Middleware\Authenticate;

use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class LogoutMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        if ($request->getUser()) {
            $request->getSession()->set('user_id', null);
        }

        $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('admin.login'));
        return $redirect->send();
    }
}