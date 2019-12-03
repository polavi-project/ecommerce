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