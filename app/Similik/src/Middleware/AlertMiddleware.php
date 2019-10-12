<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function Similik\get_js_file_url;
use Symfony\Component\HttpFoundation\Session\Session;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Helper;

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
        return true;
    }
}