<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\ShippingLocation\Middleware\Location\Save;

use Similik\App;
use Similik\Db\Mysql;
use Similik\Http\Response;
use Similik\Http\Request;
use Similik\Middleware\Delegate;
use Symfony\Component\HttpFoundation\Session\Session;

class SaveMiddleware extends Mysql
{
    /**
     * @param App $app
     * @param callable $next
     * @param null $delegate
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        try {
            $data = $request->request->all();
            $id = $request->attributes->get('id', null);
            $this->save($data, $id);
            $app->get(Session::class)->getFlashBag()->add('success', __('Shipping location has been saved'));
            $response->redirect(build_url('shipping/locations'));
        } catch (\Exception $e) {
            $app->get(Session::class)->getFlashBag()->add('error', $e->getMessage());
            if($id = get_request_attribute('id'))
                $url = build_url('shipping/location/edit/' . $id, $request->request->all());
            else
                $url = build_url('shipping/location/create', $request->request->all());
            $response->redirect($url);
        }
    }

    private function save(array $data, $id = null)
    {
        // Save Attribute
        $this->getProcessor()->startTransaction();
        $methods = json_decode($data['assigned_method_json'], true);
        $assigned_method = [];
        foreach ($methods as $method)
            $assigned_method[] = $method['code'];
        $data['shipping_methods'] = json_encode($assigned_method);
        try {
            if((int)$id) {
                $old_data = $this->getTable('shipping_location')->load((int) $id);
                if($old_data == false) {
                    throw new \RuntimeException(__('Shipping location does not exist anymore'));
                } else {
                    $this->getTable('shipping_location')->where($this->getTable('shipping_location')->getPrimary(), '=', (int)$id)->update($data);
                }
            } else {
                $this->getTable('shipping_location')->insert($data);
            }

            $this->getProcessor()->commit();
        } catch (\Exception $e) {
            $this->getProcessor()->rollback();

            throw $e;
        }
    }
}