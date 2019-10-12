<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Module\Customer\Services\Customer;
use Similik\Services\Helper;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Similik\Module\User\Services\User;

class AuthenticateMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response)
    {
        if($request->isAdmin()) {
            if($request->getSession()->get('user_id', null) == null) {
                if(
                    $request->attributes->get('_matched_route') != 'admin.login' &&
                    $request->attributes->get('_matched_route') != 'admin.authenticate'
                ) {
                    $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('admin.login'));
                    return $redirect->send();
                }
            } else {
                try {
                    $user = new User($this->loadUser($request->getSession()->get('user_id', null)));
                    $request->setUser($user);
                } catch (\Exception $e) {
                    // Customer does not exist. need to clear session information
                    $request->getSession()->set('user_id', null);
                    $response->redirect($this->getContainer()->get(Router::class)->generateUrl('admin.login'));

                    return $response;
                }
            }
        } else {
            // Create customer object and let it do the authorization
            $request->setCustomer(new Customer($request->getSession()));
        }

        return null;
    }

    protected function loadUser($id)
    {
        $user = Helper::getMysqlTable('admin_user')->load($id);
        if($user == false)
            throw new \RuntimeException('User does not exist');

        return $user;
    }
}