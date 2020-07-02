<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Middleware\Core;


use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class MiniCartMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true || $request->attributes->get('_matched_route') == 'graphql.api')
            return $delegate;

        $response->addWidget(
            'minicart',
            'header',
            10,
            get_js_file_url("production/checkout/minicart/container.js"),
            [
                'cartUrl'=> generate_url('checkout.cart'),
                'checkoutUrl'=> generate_url('checkout.index')
            ]
        );

        return $delegate;
    }
}