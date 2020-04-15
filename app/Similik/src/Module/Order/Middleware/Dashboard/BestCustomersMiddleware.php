<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Dashboard;


use function Similik\_mysql;
use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class BestCustomersMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $conn = new Processor();
        $customers = $conn->executeQuery("SELECT `customer`.customer_id, `customer`.full_name, COUNT(`order`.order_id) as orders, SUM(`order`.grand_total) as `total`
        FROM `customer`
        INNER JOIN `order`
        ON `customer`.customer_id = `order`.customer_id
        GROUP BY `customer`.customer_id
        ORDER BY `orders` DESC
        LIMIT 0, 10
        ")->fetchAll(\PDO::FETCH_ASSOC);

        array_walk($customers, function(&$c) {
            $c["editUrl"] = generate_url("customer.edit", ["id"=> $c['customer_id']]);
        });

        $response->addWidget(
            'best_customers',
            'admin_dashboard_middle_right',
            30,
            get_js_file_url("production/order/dashboard/best_customers.js", true),
            [
                'customers' => $customers,
                'listUrl' => generate_url("customer.grid")
            ]
        );

        return $delegate;
    }
}