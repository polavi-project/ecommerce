<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;

use function Polavi\get_js_file_url;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AlertMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $alerts = $request->getSession()->getFlashBag()->all();
        foreach ($alerts as $type=>$message)
            $response->addAlert('session_alert', $type, $message);
        $response->addWidget(
            'alert',
            'content',
            5,
            get_js_file_url("production/alert.js", $request->isAdmin()),
            ["alerts"=>[]]
        );

        return $delegate;
    }
}