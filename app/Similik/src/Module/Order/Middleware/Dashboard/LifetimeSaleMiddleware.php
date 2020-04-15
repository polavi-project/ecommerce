<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Dashboard;


use function Similik\_mysql;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

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
                'completed_percentage' => ceil($completed/count($orders)*100),
                'cancelled_percentage' => ceil($cancelled/count($orders)*100)
            ]
        );
    }
}