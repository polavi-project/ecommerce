<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\ShippingLocation\Middleware\Location\Grid;

use Similik\Services\Grid;
use Similik\View\Head;
use Similik\App;
use Similik\View\Body;

class GridMiddleware
{
    /**
     * @param App $app
     * @param callable $next
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $columns = [
            ['title' => 'ID', 'identifier' => 'shipping_location_id', 'sort_order' => 5],
            ['title' => 'Name', 'identifier' => 'name', 'sort_order' => 10],
            ['title' => 'Country', 'identifier' => 'country', 'sort_order' => 20],
            ['title' => 'Region', 'identifier' => 'region', 'sort_order' => 30],
            ['title' => 'Action', 'identifier' => 'action', 'sort_order' => 50, 'sort_able' => false]
        ];

        $grid = new Grid('shipping_location', __('Shipping Locations'), $delegate, $columns);
        $app[Head::class]->setTitle(__('Shipping Locations'));
        $app[Body::class]->setContent($grid->getHtml());

        return $next($app);
    }
}