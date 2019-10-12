<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Sale;

use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;
use Symfony\Component\HttpFoundation\Session\Session;

class SaveMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $processor = new Processor();
        $processor->startTransaction();
        try {
            $data = $request->request->all();
            foreach ($data as $name=> $value) {
                if(is_array($value))
                    get_mysql_table('setting', $processor)
                        ->insertOnUpdate(['name'=>$name, 'value'=>json_encode($value, JSON_NUMERIC_CHECK), 'json'=>1, 'language_id'=>0]);
                else
                    get_mysql_table('setting', $processor)
                        ->insertOnUpdate(['name'=>$name, 'value'=>$value, 'json'=>0, 'language_id'=>0]);
            }
            $processor->commit();
            $request->getApp()->get(Session::class)->getFlashBag()->add('success', __('Configuration has been saved'));
            $response->addData('redirect_url', build_url('setting/sale'));
            $delegate->stopAndResponse();
        } catch (\Exception $e) {
            $processor->rollback();
            $response->addAlert('sale_setting_update_error', 'error', $e->getMessage());
            $delegate->stopAndResponse();
        }
        return $next($request, $response, $delegate);
    }
}