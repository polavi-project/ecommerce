<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware\Authenticate;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class LogoutMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        if($request->getUser()) {
            $request->getSession()->set('user_id', null);
        }

        $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('admin.login'));
        return $redirect->send();
    }
}