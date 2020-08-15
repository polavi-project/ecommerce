<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Setting\Middleware\Payment;

use function Polavi\get_js_file_url;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Response;

class PaymentSettingMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->getMethod() == 'POST')
            return $delegate;
        $this->getContainer()->get(Helmet::class)->setTitle('Payment setting');
        $response->addWidget(
            'payment_setting',
            'content',
            10,
            get_js_file_url("production/setting/payment/payment.js", true)
        );

        return $delegate;
    }
}