<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cod\Middleware\Order;


use function Similik\generate_url;
use function Similik\get_config;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class CodPaymentMiddleware extends MiddlewareAbstract
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
            'cod_payment_name',
            'order_payment_block_info',
            11,
            get_js_file_url("production/cod/order/cod_name.js", true),
            [
            ]
        );

        $response->addWidget(
            'cod_payment_action',
            'order_payment_block_info',
            12,
            get_js_file_url("production/cod/order/cod_action.js", true),
            [
                'payOfflineUrl' => generate_url('order.offline.pay', ['id'=>$request->attributes->get('id')]),
                'refundOfflineUrl' => generate_url('order.offline.pay', ['id'=>$request->attributes->get('id')])
            ]
        );

        return $delegate;
    }
}