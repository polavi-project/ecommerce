<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\User\Middleware\Authenticate;

use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Module\User\Services\Authenticator;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class AuthenticateMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        try {
            $email = $request->get('email', null);
            $password = $request->get('password', null);
            $this->getContainer()->get(Authenticator::class)->login($email, $password);
            $response->addData('success', 1)->redirect($this->getContainer()->get(Router::class)->generateUrl('dashboard'))->notNewPage();

            return $response;
        } catch (\Exception $e) {
            $response->addAlert('login_error', 'error', $e->getMessage())->notNewPage();

            return $response;
        }
    }
}