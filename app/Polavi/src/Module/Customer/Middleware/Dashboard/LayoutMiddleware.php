<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Dashboard;

use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class LayoutMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if (!$request->getCustomer()->isLoggedIn()) {
            $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('customer.login'));
            return $redirect->send();
        }

        $this->getContainer()->get(Helmet::class)->setTitle("Account dashboard");
        $response->addWidget(
            'customer_dashboard_layout',
            'content_center',
            10,
            get_js_file_url("production/area.js", false),
            [
                'className'=> "row",
                'id'=> "customer_dashboard_layout"
            ]
        );

        return $delegate;
    }
}