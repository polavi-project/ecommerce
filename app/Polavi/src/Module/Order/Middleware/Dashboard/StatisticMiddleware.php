<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Dashboard;


use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class StatisticMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'saleStatistic',
            'admin_dashboard_middle_left',
            10,
            get_js_file_url("production/order/dashboard/statistic.js", true)
        );
    }
}