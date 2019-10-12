<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\ShippingLocation\Middleware\Location\Edit;

use Similik\App;
use Similik\Db\Mysql;
use Similik\Services\Locale\Province;
use Similik\Http\Request;
use Similik\Middleware\Delegate;

class DataMiddleware extends Mysql
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        try {
            $id = $request->get('id');
            $shipping_location = $this->getTable('shipping_location')->load($id);
            if($shipping_location == false)
                throw new \RuntimeException("Shipping location ID #{$id} does not exist");
            $shipping_location['regions'] = Province::listStateV3();

            $stmt = $app->get('shipping_methods');
            $methods = [];
            foreach ($stmt as $key=>$value) {
                $methods[] = ['code'=>$key, 'name'=>$value->getName()];
            }
            $json = json_decode($shipping_location['shipping_methods'], true);
            if(!$json)
                $json = [];
            $assigned_methods = [];
            foreach ($json as $code) {
                if(isset($stmt[$code]))
                    $assigned_methods[] = ['code'=>$code, 'name'=>$stmt[$code]->getName()];
            }
            $shipping_location['assigned_methods'] = $assigned_methods;
            $shipping_location['methods'] = $methods;
            $shipping_location['save_action'] = build_url('shipping/location/save/' . $id);
            return $next($app, $shipping_location);
        } catch (\Exception $e) {
            return $next($app, $e);
        }
    }
}