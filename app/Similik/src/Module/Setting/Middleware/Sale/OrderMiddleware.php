<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Sale;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;
use Symfony\Component\EventDispatcher\GenericEvent;

class OrderMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $fields = [
            ['id'=>'sale_order_complete_check', 'name'=> 'sale_order_complete_check', 'type'=> 'select', 'label'=> 'Complete order when', 'options'=> [['value'=>1, 'text'=>'Shipment completed'], ['value'=>2, 'text'=>'Payment completed'], ['value'=>3, 'text'=>'Shipment and payment completed']]],
        ];
        $data = $delegate->get('data');
        array_walk($fields, function(&$field) use($data) {
            if(isset($data[$field['id']]))
                $field['value'] = $data[$field['id']];
            else
                $field['value'] = "";
        });
        $event = new GenericEvent(null, [$fields]);
        dispatch_event('register_sale_setting_order_field', $event);
        $languages = get_display_languages();
        array_unshift($languages, get_default_language());
        $response->addWidget(
            'sale_setting_order_group',
            'sale_setting_form',
            40,
            get_js_file_url("production/form_group.js"),
            ["id"=>"sale_setting_order_group", "name"=>"Order"]
        );
        foreach ($event->getArgument(0) as $key =>$field) {
            switch ($field['type']) {
                case "text":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/text.js"),
                        $field
                    );
                    break;
                case "datetime":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/datetime.js"),
                        $field
                    );
                    break;
                case "date":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/date.js"),
                        $field
                    );
                    break;
                case "select":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/select.js"),
                        $field
                    );
                    break;
                case "multiselect":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/multiselect.js"),
                        $field
                    );
                    break;
                case "textarea":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/textarea.js"),
                        $field
                    );
                    break;
                case "hidden":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/hidden.js"),
                        $field
                    );
                    break;
                case "password":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_order_group',
                        $key * 10,
                        get_js_file_url("production/formelements/password.js"),
                        $field
                    );
            }
        }
        return $next($request, $response, $delegate);
    }
}