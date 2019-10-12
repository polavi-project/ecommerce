<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Grid;

use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class GridMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('customer_grid'))
            return $delegate;

        $fields = "";
        $columns = $request->attributes->get('customer.grid.column', []);
        foreach ($columns as $col)
            if(isset($col['graphql_field']))
                $fields .= "{$col['graphql_field']} ";

        $filter = http_build_query($request->query->all() + ['limit'=>20]);
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> <<< QUERY
                    {
                        admin_customer_grid (filter: "{$filter}") {
                            customers {
                                {$fields}
                            }
                            total
                        }
                    }
QUERY
            ])
            ->then(function($data) use ($request, $response, $columns) {
                $rows = [];
                $total = 0;
                /**@var \GraphQL\Executor\ExecutionResult[] $data */
                if(is_array($data)) {
                    foreach ($data as $item) {
                        //var_dump($item->data);
                        //var_dump($item->errors);
                        if (isset($item->data['admin_customer_grid'])) {
                            $rows = $item->data['admin_customer_grid']['customers'];
                            array_walk($rows, function(&$value) {
                                $value['status'] = $value['status'] == 1 ? "Active" : "Inactive";
                            });
                            foreach ($rows as &$row) {
                                $row['action'] = [
                                    [
                                        'text'=>'Edit',
                                        'url'=>$this->getContainer()->get(Router::class)->generateUrl("customer.edit", ['id'=>$row['customer_id']])
                                    ]
                                ];
                            }
                            $total = $item->data['admin_customer_grid']['total'];
                            break;
                        }
                    }
                }

                $response->addWidget(
                    'customer_grid',
                    'content',
                    20, get_js_file_url("production/grid/grid.js"),
                    [
                        "id" => "customer.grid",
                        "columns"=> $columns,
                        "rows"=> $rows,
                        "total"=> $total,
                        "filters" => $request->query->all(),
                    ]
                );
            })->otherwise(function($reason) use($response) {
                $response->addAlert('data_fetch_error', 'error', $reason->getMessage())->notNewPage();
            });

        return null;
    }
}