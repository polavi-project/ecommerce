<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\ShippingLocation\Middleware\Location\Grid;

use Similik\App;
use Similik\Db\Mysql;
use Similik\Services\Url;
use Similik\Http\Request;
use Similik\Middleware\Delegate;

class DataMiddleware extends Mysql
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $setting = [
            'sort_by'    => $request->get('sort_by'),
            'sort_order' => $request->get('sort_order'),
            'page'       => $request->get('page'),
            'limit'      => $request->get('limit') ? $request->get('limit') : 20
        ];

        $shipping_locations = $this->getTable('shipping_location')->fetchAssoc($setting);
        array_walk($shipping_locations, function(&$value){
            $url = Url::buildUrl('shipping/location/edit/' . $value['shipping_location_id']);
            $value['action'] = "<a href='{$url}'>" . __('Edit') . "</a>";
        });
        return $next($app, $shipping_locations);
    }
}