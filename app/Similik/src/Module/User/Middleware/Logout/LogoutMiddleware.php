<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware\User\Logout;

use Similik\Http\Request; 
use Similik\Middleware\Delegate;
use Similik\Http\Response;
use Symfony\Component\HttpFoundation\Session\Session;

class LogoutMiddleware
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        the_app()->get(Session::class)->set('user_id', null);
        the_app()->get(Session::class)->set('user_email', null);
        $response->redirect(build_url('login'));
    }
}