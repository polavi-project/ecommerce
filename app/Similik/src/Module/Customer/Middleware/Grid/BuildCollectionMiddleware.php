<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Grid;

use Similik\Module\Customer\Services\CustomerGridCollection;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class BuildCollectionMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $columns = $request->attributes->get('customer.grid.column', []);

        foreach ($columns as $column) {
            if(isset($column['table']))
                $this->getContainer()
                    ->get(CustomerGridCollection::class)
                    ->addColumn(
                        $column['table'],
                        $column['column'],
                        isset($column['graphql_field']) ? $column['graphql_field'] : $column['column'],
                        isset($column['join_type']) ? $column['join_type'] : null
                    );
        }

        return $delegate;
    }
}