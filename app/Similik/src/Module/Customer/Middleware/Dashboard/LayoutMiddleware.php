<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Dashboard;

use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class LayoutMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$request->getCustomer()->isLoggedIn()) {
            $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('customer.login'));
            return $redirect->send();
        }

        $this->getContainer()->get(Helmet::class)->setTitle("Account dashboard");
        $response->addWidget(
            'customer_dashboard_layout',
            'content',
            10,
            get_js_file_url("production/area.js", false),
            [
                'className'=> "uk-child-width-1-2@m uk-grid",
                'id'=> "customer_dashboard_layout"
            ]
        );

        return $delegate;
    }
}