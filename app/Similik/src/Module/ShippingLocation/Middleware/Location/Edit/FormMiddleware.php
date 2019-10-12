<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\ShippingLocation\Middleware\Location\Edit;

use Similik\Http\Response;
use Similik\Services\Form\Form;
use Similik\Services\Locale\Country;
use Similik\View\Head;
use Similik\App;
use Similik\View\Body;
use Symfony\Component\HttpFoundation\Session\Session;

class FormMiddleware extends Form
{
    const SCRIPT_TEMPLATE = <<< 'EOT'
<script type="text/javascript">
	// <![CDATA[
		$(document).ready(function(){
            ko.applyBindings(new %s());
        })
// ]]>
</script>
EOT;

    public function __construct(array $data = [])
    {
        if($id = get_request_attribute('id'))
            parent::__construct('shipping_location_form', 'POST', build_url('shipping/location/save/' . $id), $data, false, ['data-bind'=>"submit: doSomething"]);
        else
            parent::__construct('shipping_location_form', 'POST', build_url('shipping/location/save'), $data, false, ['data-bind'=>"submit: doSomething"]);
        $this->defineFields();
    }

    protected function defineFields()
    {
        $information_fields = [
            ['name'=> 'name', 'type'=> 'text', 'label'=> __('Location Name'), 'validate'=>['required']],
            ['name'=> 'country', 'type'=> 'select', 'label'=> __('Country'), 'options'=>Country::listCountries(), 'caption_text'=> __('Please Select Country')],
            ['name'=> 'region', 'type'=> 'select', 'label'=> __('Region'), 'options'=>[], 'caption_text'=> __('Please Select Region')],
            ['name'=> 'assigned_method_json', 'type'=> 'hidden']
        ];
        $methods_fields = [
            ['html'=> load_template('location/methods.phtml'), 'type'=> 'html']
        ];

        $this->addGroup('general', __('General'), '0', 'column column-2')->addFields($information_fields);
        $this->addGroup('methods', __('Shipping Methods'), '10', 'column column-2')->addFields($methods_fields);
    }

    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        if($delegate instanceof \Exception)
        {
            $app->get(Session::class)->getFlashBag()->add('error', $delegate->getMessage());
            $response->redirect(build_url('shipping/locations'));
            return $next($app, $response);
        }

        if(get_request_attribute('id'))
            $app[Head::class]->setTitle(sprintf(__('Editing Shipping Location %s'), $delegate['name']));
        else
            $app[Head::class]->setTitle(__('Create New Shipping Location'));
        if($delegate == null)
            $delegate = [];
        $this->addData($delegate)->setKoObject('ShippingLocation');
        $app[Body::class]->setContent($this->getHtml());
        return $next($app);
    }
}