<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
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