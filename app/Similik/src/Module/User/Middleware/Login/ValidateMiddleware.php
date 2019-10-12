<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware\Login;

use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;

class ValidateMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $user_id = $this->getContainer()->get(Session::class)->get('user_id', null);
        if($user_id) {
            $response->addData('success', 1)->redirect($this->getContainer()->get(Router::class)->generateUrl('product.create'));
            return $response;
        }
        $this->getContainer()->get(Helmet::class)->setTitle("Admin login");

        return $delegate;
    }
}