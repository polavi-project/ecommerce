<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\ShippingLocation\Middleware\Location\Save;

use Similik\App;
use Similik\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Http\Response;
use Similik\Module\ShippingLocation\Middleware\Location\Edit\FormMiddleware;

class ValidateMiddleware extends FormMiddleware
{
    public function __construct()
    {
        $data = the_app()->get(Request::class)->request->all();
        parent::__construct($data);
    }

    /**
     * @param App $app
     * @param callable $next
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $data = $request->request->all();
        $flag = $this->validate();
        if(!isset($data['assigned_method_json']) or $data['assigned_method_json'] == '[]') {
            add_flash_session('error', __('There is no shipping method added'));
            $flag = false;
        }
        if($flag == false) {
            if($id = get_request_attribute('id'))
                $url = build_url('shipping/location/edit/' . $id, $data);
            else
                $url = build_url('shipping/location/create', $data);
            $response->redirect($url);

            return null;
        } else {
            return $next($app);
        }
    }
}