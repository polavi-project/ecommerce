<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Dashboard;


use function Polavi\_mysql;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class LifetimeSaleMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $orders = _mysql()->getTable('order')
            ->addFieldToSelect("order_id")
            ->addFieldToSelect("grand_total")
            ->addFieldToSelect("payment_status")
            ->addFieldToSelect("shipment_status")
            ->fetchAllAssoc();
        $total = 0;
        $cancelled = 0;
        $completed = 0;

        foreach ($orders as $order) {
            $total += $order['grand_total'];
            if($order['payment_status'] == 'paid' && $order['shipment_status'] == "delivered")
                $completed++;

            if($order['payment_status'] == 'cancelled' && $order['shipment_status'] == "cancelled")
                $cancelled++;
        }

        $response->addWidget(
            'bestSellers',
            'admin_dashboard_middle_right',
            10,
            get_js_file_url("production/order/dashboard/lifetime_sale.js", true),
            [
                'orders' => count($orders),
                'total' => $total,
                'completed_percentage' => count($orders) == 0 ? 0 : ceil($completed/count($orders)*100),
                'cancelled_percentage' => count($orders) == 0 ? 0 : ceil($cancelled/count($orders)*100)
            ]
        );
    }
}