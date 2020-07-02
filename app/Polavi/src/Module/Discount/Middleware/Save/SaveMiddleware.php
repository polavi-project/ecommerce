<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Middleware\Save;

use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class SaveMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $data = $request->request->all();
        if(isset($data['free_shipping']))
            $data['free_shipping'] = 1;
        else
            $data['free_shipping'] = 0;
        try {
            $conn = _mysql();
            if($request->attributes->get('id'))
                $conn->getTable('coupon')->where('coupon_id', '=', $request->attributes->get('id'))->update($data);
            else
                $conn->getTable('coupon')->insert($data);
            $response->addAlert("coupon_save_success", "success", "Coupon saved successfully");
            $response->addData("redirect", $this->getContainer()->get(Router::class)->generateUrl('coupon.grid'));
        } catch (\Exception $e) {
            $response->addAlert('coupon_save_error', 'error', $e->getMessage())->notNewPage();
        }

        return $response;
    }
}