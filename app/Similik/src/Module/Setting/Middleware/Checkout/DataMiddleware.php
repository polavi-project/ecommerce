<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Checkout;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;

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