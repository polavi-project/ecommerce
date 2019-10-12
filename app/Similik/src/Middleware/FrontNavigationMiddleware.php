<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;


use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class FrontNavigationMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() || $request->getMethod() != "GET")
            return $delegate;

        $response->addWidget(
            'front_navigation',
            'menu',
            0,
            get_js_file_url("production/cms/navigation.js"),
            [
                "items" => [
                    [
                        'url'=> $this->getContainer()->get(Router::class)->generateUrl('category.view', ['id'=>1]),
                        'name'=> "Just a category"
                    ],
                    [
                        'url'=> $this->getContainer()->get(Router::class)->generateUrl('checkout.cart'),
                        'name'=> "Shopping cart"
                    ],
                    [
                        'url'=> $this->getContainer()->get(Router::class)->generateUrl('checkout.index'),
                        'name'=> "Checkout"
                    ]
                ]
            ]
        );

        return true;
    }
}