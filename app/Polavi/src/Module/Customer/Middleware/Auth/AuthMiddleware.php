<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Auth;


use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AuthMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->getCustomer()->isLoggedIn()) {
            $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('homepage'));
            return $redirect->send();
        }

        $email = $request->request->get('email');
        $password = $request->request->get('password');
        try {
            $request->getCustomer()->login($email, $password);
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('homepage'));
        } catch (\Exception $e) {
            $response->addAlert('customer_login_error', 'error', $e->getMessage())->notNewPage();
        }

        return $delegate;
    }
}