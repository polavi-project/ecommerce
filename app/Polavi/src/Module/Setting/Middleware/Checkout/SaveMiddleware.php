<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Setting\Middleware\Checkout;

use Polavi\Db\Mysql;
use Polavi\Http\Request;
use Polavi\Middleware\Delegate;
use Polavi\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;

class SaveMiddleware extends Mysql extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @param Delegate|null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $this->getProcessor()->startTransaction();
        try {
            $data = $request->request->all();
            if(isset($data['language-switcher']))
                unset($data['language-switcher']);
            foreach ($data as $name=> $value) {
                if(is_array($value))
                    $this->getTable('setting')
                        ->insertOnUpdate(['name'=>$name, 'value'=>json_encode($value, JSON_NUMERIC_CHECK), 'json'=>1, 'language_id'=>0]);
                else
                    $this->getTable('setting')
                        ->insertOnUpdate(['name'=>$name, 'value'=>$value, 'json'=>0, 'language_id'=>0]);
            }
            $this->getProcessor()->commit();
            the_app()->get(Session::class)->getFlashBag()->add('success', __('Configuration has been saved'));
            $delegate->stopAndResponse(new RedirectResponse(build_url('setting/checkout')));
        } catch (\Exception $e) {
            $this->getProcessor()->rollback();
            the_app()->get(Session::class)->getFlashBag()->add('error', $e->getMessage());
            $delegate->stopAndResponse(new RedirectResponse(build_url('setting/checkout')));
        }
        return $next($request, $response, $delegate);
    }
}