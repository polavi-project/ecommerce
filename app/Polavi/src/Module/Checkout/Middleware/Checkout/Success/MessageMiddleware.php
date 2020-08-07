<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Checkout\Success;


use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class MessageMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$request->getSession()->get('orderId')) {
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('homepage'));

            return $response;
        };

        if($request->isAjax())
            $request->getSession()->remove('orderId');

        $this->getContainer()->get(Helmet::class)->setTitle("Checkout success");
        $response->addWidget(
            'checkout_success_message',
            'content_center',
            10,
            get_js_file_url("production/checkout/checkout/success/message.js"),
            [
                "message" => "Thank you, we will send you a notification email",
                "homeUrl" => generate_url("homepage")
            ]
        );

        return $delegate;
    }
}