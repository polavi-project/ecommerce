<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Setting\Middleware\Payment;

use function Polavi\_mysql;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;
// TODO: move this middleware to COD module
class CODSaveMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->getMethod() != 'POST' or $request->attributes->get('method') != 'cod')
            return $delegate;

        $processor = _mysql();
        $processor->startTransaction();
        try {
            $data = $request->request->all();
            foreach ($data as $name=> $value) {
                if (is_array($value))
                    $processor->getTable('setting')
                        ->insertOnUpdate([
                            'name'=>$name,
                            'value'=>json_encode($value, JSON_NUMERIC_CHECK),
                            'json'=>1
                        ]);
                else
                    $processor->getTable('setting')
                        ->insertOnUpdate([
                            'name'=>$name,
                            'group'=>'general',
                            'value'=>$value,
                            'json'=>0
                        ]);
            }
            $processor->commit();
            $this->getContainer()->get(Session::class)->getFlashBag()->add('success', 'Setting saved');
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('setting.payment'));
        } catch (\Exception $e) {
            $processor->rollback();
            $response->addAlert('payment_setting_update_error', 'error', $e->getMessage());
        }

        return $response;
    }
}