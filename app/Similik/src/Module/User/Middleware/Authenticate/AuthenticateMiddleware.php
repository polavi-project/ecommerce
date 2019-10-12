<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware\Authenticate;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Module\User\Services\Authenticator;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class AuthenticateMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        try {
            $email = $request->get('email', null);
            $password = $request->get('password', null);
            $this->getContainer()->get(Authenticator::class)->login($email, $password);
            $response->addData('success', 1)->redirect($this->getContainer()->get(Router::class)->generateUrl('product.create'))->notNewPage();

            return $response;
        } catch (\Exception $e) {
            $response->addAlert('login_error', 'error', $e->getMessage())->notNewPage();

            return $response;
        }
    }
}