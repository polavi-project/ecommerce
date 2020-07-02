<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware;


use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class HeaderIconMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true || in_array($request->attributes->get('_matched_route'), ['graphql.api']))
            return $delegate;

        $response->addWidget(
            'customer_header_greeting',
            'header',
            20,
            get_js_file_url("production/customer/header_block.js", false),
            [
                'fullName' => $request->getCustomer()->getData('full_name'),
                'isLoggedIn' => $request->getCustomer()->isLoggedIn(),
                'registerUrl' => $this->getContainer()->get(Router::class)->generateUrl('customer.register'),
                'loginUrl' => $this->getContainer()->get(Router::class)->generateUrl('customer.login'),
                'logoutUrl' => $this->getContainer()->get(Router::class)->generateUrl('customer.logout'),
                'myAccountUrl' => $this->getContainer()->get(Router::class)->generateUrl('customer.dashboard')
            ]
        );

        return $delegate;
    }
}