<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Middleware\Core;


use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

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