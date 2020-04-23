<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Grid;

use function Similik\_mysql;
use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

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

        $this->getContainer()->get(Helmet::class)->setTitle("Customers");
        $response->addWidget(
            'coupon_grid_container',
            'content',
            0,
            get_js_file_url("production/grid/grid.js", true),
            ['id'=>"customer_grid_container"]
        );

        $groups = _mysql()->getTable('customer_group')->where('customer_group_id', '<', 999)->fetchAllAssoc();
        $response->addWidget(
            'customer_grid',
            'customer_grid_container',
            20, get_js_file_url("production/customer/grid/grid.js", true),
            [
                "apiUrl" => generate_url('admin.graphql.api'),
                "groups" => $groups
            ]
        );

        return $delegate;
    }
}