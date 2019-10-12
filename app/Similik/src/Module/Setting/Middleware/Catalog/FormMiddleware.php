<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Catalog;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;
use Symfony\Component\EventDispatcher\GenericEvent;

class FormMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $fields = [
            ['id'=> 'catalog_display_mode', 'name'=> 'catalog_display_mode', 'type'=> 'select', 'label'=> __('Product List Display Mode'), "options"=>[['value'=>0, 'text'=>'List/Grid'], ['value'=>1, 'text'=>'Grid/List'], ['value'=>2, 'text'=>'List only'], ['value'=>3, 'text'=>'Grid only']]],
            ['id'=> 'catalog_product_list_limit', 'name'=> 'catalog_product_list_limit', 'type'=> 'text', 'label'=> __('Products Per Page'), 'validate'=> ['required', 'number']],
            ['id'=> 'catalog_out_of_stock_display', 'name'=> 'catalog_out_of_stock_display', 'type'=> 'select', 'label'=> __('Display Out Of Stock Product'), 'options'=>[['value'=>0, 'text'=>'No'], ['value'=>1, 'text'=>'Yes']]],
            ['id'=> 'catalog_price_display', 'name'=> 'catalog_price_display', 'type'=> 'select', 'label'=> __('Display Price On Website'), 'options'=>[['value'=>0, 'text'=>'Excluding tax'], ['value'=>1, 'text'=>'Including tax'], ['value'=>2, 'text'=>'Both']]]
        ];
        $general_data = $delegate->get('data');
        array_walk($fields, function(&$field) use($general_data) {
            if(isset($general_data[$field['id']]))
                $field['value'] = $general_data[$field['id']];
            else
                $field['value'] = "";
        });
        $event = new GenericEvent(null, [$fields]);
        dispatch_event('register_general_setting_field', $event);
        $languages = get_display_languages();
        array_unshift($languages, get_default_language());
        $response->addWidget(
            'general_setting_form',
            'content',
            10,
            get_js_file_url("production/form.js"),
            [
                "id"=>"general_setting_form",
                'languages'=>$languages,
                'multiple_language'=>true,
                "action"=> build_url("setting/catalog/save")
            ]
        );
        $response->addWidget(
            'general_setting_general_group',
            'general_setting_form',
            10,
            get_js_file_url("production/form_group.js"),
            ["id"=>"general_setting_general_group", "name"=>"General"]
        );
        foreach ($event->getArgument(0) as $key =>$field) {
            switch ($field['type']) {
                case "text":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/text.js"),
                        $field
                    );
                    break;
                case "datetime":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/datetime.js"),
                        $field
                    );
                    break;
                case "date":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/date.js"),
                        $field
                    );
                    break;
                case "select":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/select.js"),
                        $field
                    );
                    break;
                case "multiselect":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/multiselect.js"),
                        $field
                    );
                    break;
                case "textarea":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/textarea.js"),
                        $field
                    );
                    break;
                case "hidden":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/hidden.js"),
                        $field
                    );
                    break;
                case "password":
                    $response->addWidget(
                        'general_setting_' . $field['id'],
                        'general_setting_general_group',
                        $key * 10,
                        get_js_file_url("production/formelements/password.js"),
                        $field
                    );
            }
        }
        return $next($request, $response, $delegate);
    }
}