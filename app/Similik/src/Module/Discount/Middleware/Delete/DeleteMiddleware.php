<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Middleware\Delete;


use function Similik\_mysql;
use function Similik\generate_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class DeleteMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $id = $request->attributes->get('id');
        try {
            _mysql()->getTable('coupon')->where('coupon_id', '=', $id)->delete();
            $response->addAlert("coupon_delete_success", "success", "Coupon deleted");
            $response->redirect(generate_url('coupon.grid'));
        } catch (\Exception $e) {
            $response->addAlert("coupon_delete_error", "error", $e->getMessage())->notNewPage();
        }

        return $delegate;
    }
}