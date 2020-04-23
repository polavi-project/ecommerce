<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\GoogleAnalytics\Middleware\Setting;

use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Response;

class FormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getMethod() == 'POST')
            return $delegate;

        $response->addWidget(
            'general_google_analytics',
            'general_setting_form_web',
            50,
            get_js_file_url("production/google_analytics/setting_code.js", true)
        );

        return $delegate;
    }
}