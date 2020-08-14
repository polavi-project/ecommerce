<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;

use function Polavi\get_config;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class ConfigMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // Set time zone
        @date_default_timezone_set(get_config('general_timezone', 'Europe/London'));

        return $delegate;
    }
}