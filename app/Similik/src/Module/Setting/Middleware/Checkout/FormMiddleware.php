<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Checkout;

use Similik\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Form\Form;
use Similik\Services\Locale\Province;
use Similik\Middleware\MiddlewareAbstract;
use Similik\View\Head;
use Similik\Http\Response;
use Similik\View\Body;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;

class FormMiddleware extends Form extends MiddlewareAbstract
{
    public function __construct(array $data = [])
    {
        parent::__construct('checkout_form_setting', 'POST', build_url('setting/checkout/save'), $data, false);
        $this->defineFields();
    }

    protected function defineFields()
    {
        $general_fields = [
            ['name'=> 'checkout_allow_guest', 'type'=> 'select', 'label'=> __('Allow guest checkout'), 'options'=>[1=> __('Yes'), 0=> __('No')]]
        ];
        $paypal_express_fields = [
            ['name'=> 'checkout_paypal_status', 'type'=> 'select', 'label'=> __('Enable?'), 'options'=>[1=> __('Yes'), 0=> __('No')]],
            ['name'=> 'checkout_paypal_client_id', 'type'=> 'text', 'label'=> __('Paypal client ID'), 'validation_rules'=>['required']],
            ['name'=> 'checkout_paypal_client_secret', 'type'=> 'text', 'label'=> __('Paypal client secret'), 'validation_rules'=>['required']],
            ['name'=> 'checkout_paypal_payment_action', 'type'=> 'select', 'label'=> __('Payment action'), 'options'=>['authorize'=> __('Authorize'), 'sale'=> __('Capture')]],
            ['name'=> 'checkout_paypal_is_sandbox', 'type'=> 'select', 'label'=> __('Payment Mode?'), 'options'=>['sandbox'=> __('Sandbox'), 'live'=> __('Live')]],
            ['name'=> 'checkout_paypal_enable_log', 'type'=> 'select', 'label'=> __('Enable Log?'), 'options'=>[1=> __('Yes'), 0=> __('No')]]
        ];

        $this->addGroup('price', __('General setting'), '0', 'column column-2')->addFields($general_fields);
        $this->addGroup('tax', __('Paypal express Setting'), '10', 'column column-2')->addFields($paypal_express_fields);
    }

    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        if($delegate instanceof \Exception) {
            the_app()->get(Session::class)->getFlashBag()->add('error', $delegate->getMessage());
            $delegate->stopAndResponse(new RedirectResponse(build_url('dashboard')));
        } else {
            $delegate['regions'] = Province::listStateV3();
            $this->addData($delegate->toArray());
            the_app()[Head::class]->setTitle(__('Checkout Setting'));
            the_app()[Body::class]->setContent($this->getHtml());
        }
        return $next($request, $response, $delegate);
    }
}