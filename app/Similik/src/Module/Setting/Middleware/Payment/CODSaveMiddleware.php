<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Payment;

use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;
// TODO: move this middlewre to COD module
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
        if($request->getMethod() != 'POST' or $request->attributes->get('method') != 'cod')
            return $delegate;

        $processor = _mysql();
        $processor->startTransaction();
        $language = $request->attributes->get('language', get_default_language_Id());
        $language = $language == get_default_language_Id() ? 0 : $language;
        try {
            $data = $request->request->all();
            foreach ($data as $name=> $value) {
                if(is_array($value))
                    $processor->getTable('setting')
                        ->insertOnUpdate([
                            'name'=>$name,
                            'value'=>json_encode($value, JSON_NUMERIC_CHECK),
                            'json'=>1,
                            'language_id'=>$language
                        ]);
                else
                    $processor->getTable('setting')
                        ->insertOnUpdate([
                            'name'=>$name,
                            'group'=>'general',
                            'value'=>$value,
                            'json'=>0,
                            'language_id'=>$language
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