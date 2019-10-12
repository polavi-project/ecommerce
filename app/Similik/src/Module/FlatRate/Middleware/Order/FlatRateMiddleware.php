<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\FlatRate\Middleware\Order;


use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class FlatRateMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return null
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'flat_rate_name',
            'order_shipment_info',
            11,
            get_js_file_url("production/flat_rate/order/flat_rate_name.js", true),
            [
                'title' => get_config('shipment_flat_rate_title', 'FlatRate')
            ]
        );

        return $delegate;
    }
}