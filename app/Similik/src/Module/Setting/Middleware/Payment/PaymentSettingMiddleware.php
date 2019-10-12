<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Payment;

use function Similik\_mysql;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class PaymentSettingMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getMethod() == 'POST')
            return $delegate;

        $response->addWidget(
            'payment_setting',
            'content',
            10,
            get_js_file_url("production/setting/payment/payment.js", true)
        );

        return $delegate;
    }
}