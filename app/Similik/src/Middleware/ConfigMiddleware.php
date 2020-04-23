<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function Similik\get_config;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class ConfigMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // Set time zone
        @date_default_timezone_set(get_config('general_timezone', 'Europe/London', 0));

        return $delegate;
    }
}