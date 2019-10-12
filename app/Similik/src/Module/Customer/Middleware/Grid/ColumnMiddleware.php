<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Grid;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class ColumnMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $columns = [
            [
                'name' => 'ID',
                'column' => 'customer_id',
                'graphql_field' => 'customer_id',
                'table' => 'customer',
                'sortable' => true,
                'filterable'=>true,
                'filter_type'=>'range'
            ],
            [
                'name' => 'Email',
                'column' => 'email',
                'graphql_field' => 'email',
                'table' => 'customer',
                'sortable' => true,
                'filterable'=>true,
                'filter_type'=>'text'
            ],
            [
                'name' => 'Status',
                'column' => 'status',
                'graphql_field' => 'status',
                'table' => 'customer',
                'sortable' => true,
                'filterable'=>true,
                'filter_type'=>'select',
                'filter_options'=>[
                    [
                        'value'=>1,
                        'text'=> 'Active'
                    ],
                    [
                        'value'=>0,
                        'text'=> 'Inactive'
                    ]
                ]
            ],
            [
                'name' => 'Action',
                'column' => 'action',
                'sortable' => false,
                'filterable' => false
            ]
        ];

        $request->attributes->set('customer.grid.column', $columns);

        return $delegate;
    }
}