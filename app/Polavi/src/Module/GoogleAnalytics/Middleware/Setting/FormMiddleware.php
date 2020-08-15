<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\GoogleAnalytics\Middleware\Setting;

use function Polavi\get_js_file_url;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Response;

class FormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->getMethod() == 'POST')
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