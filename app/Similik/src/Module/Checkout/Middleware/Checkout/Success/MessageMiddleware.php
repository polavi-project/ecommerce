<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Checkout\Success;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

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
            'content',
            10,
            get_js_file_url("production/checkout/checkout/success/message.js"),
            [
                "message"=> "Thank you, we will send you a notification email"
            ]
        );

        return $delegate;
    }
}