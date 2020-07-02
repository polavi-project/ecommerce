<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cod\Middleware\Order;


use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Checkout\Services\Cart\Cart;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

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
            'cod_payment_action',
            'order_payment_block_info',
            30,
            get_js_file_url("production/cod/order/cod_action.js", true),
            [
                'orderEditUrl' => generate_url('order.edit', ['id'=>$request->attributes->get('id')]),
                'payOfflineUrl' => generate_url('order.offline.pay', ['id'=>$request->attributes->get('id')]),
                'refundOfflineUrl' => generate_url('order.offline.refund', ['id'=>$request->attributes->get('id')])
            ]
        );

        return $delegate;
    }
}