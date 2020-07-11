<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Setting\Middleware\Checkout;

use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\Delegate;
use Polavi\Middleware\MiddlewareAbstract;

class DataMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $sale_setting = get_mysql_table('setting')
            ->where('name', 'LIKE', 'checkout_%');
        $data = [];
        while ($row = $sale_setting->fetch()) {
            if($row['json'] == 1)
                $data[$row['name']] = json_decode($row['value'], true);
            else
                $data[$row['name']] = $row['value'];
        }
        $delegate->set('data', $data);
        return $next($request, $response, $data);
    }
}