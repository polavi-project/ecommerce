<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

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
                'full_name' => $request->getCustomer()->getData('full_name'),
                'isLoggedIn' => $request->getCustomer()->isLoggedIn(),
                'loginUrl' => $this->getContainer()->get(Router::class)->generateUrl('customer.login'),
                'logoutUrl' => $this->getContainer()->get(Router::class)->generateUrl('customer.logout'),
                'myAccountUrl' => $this->getContainer()->get(Router::class)->generateUrl('customer.dashboard')
            ]
        );

        return $delegate;
    }
}