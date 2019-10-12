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

class CouponMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $fields = [
            ['id'=>'sale_discount_calculation_rounding', 'name'=> 'sale_discount_calculation_rounding', 'type'=> 'select', 'label'=> 'Discount calculation rounding', 'options'=> [['value'=>0, 'text'=>'Round'], ['value'=>1, 'text'=>'Round up'], ['value'=>-1, 'text'=>'Round down']]],
            ['id'=>'sale_discount_calculation_rounding_level', 'name'=> 'sale_discount_calculation_rounding_level', 'type'=> 'select', 'label'=> 'Discount calculation rounding level', 'options'=> [['value'=>0, 'text'=>'Unit coupon'], ['value'=>1, 'text'=>'Row total']]]
        ];
        $data = $delegate->get('data');
        array_walk($fields, function(&$field) use($data) {
            if(isset($data[$field['id']]))
                $field['value'] = $data[$field['id']];
            else
                $field['value'] = "";
        });
        $event = new GenericEvent(null, [$fields]);
        dispatch_event('register_sale_setting_coupon_field', $event);
        $languages = get_display_languages();
        array_unshift($languages, get_default_language());
        $response->addWidget(
            'sale_setting_coupon_group',
            'sale_setting_form',
            30,
            get_js_file_url("production/form_group.js"),
            ["id"=>"sale_setting_coupon_group", "name"=>"Coupon"]
        );
        foreach ($event->getArgument(0) as $key =>$field) {
            switch ($field['type']) {
                case "text":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/text.js"),
                        $field
                    );
                    break;
                case "datetime":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/datetime.js"),
                        $field
                    );
                    break;
                case "date":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/date.js"),
                        $field
                    );
                    break;
                case "select":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/select.js"),
                        $field
                    );
                    break;
                case "multiselect":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/multiselect.js"),
                        $field
                    );
                    break;
                case "textarea":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/textarea.js"),
                        $field
                    );
                    break;
                case "hidden":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/hidden.js"),
                        $field
                    );
                    break;
                case "password":
                    $response->addWidget(
                        'sale_setting_' . $field['id'],
                        'sale_setting_coupon_group',
                        $key * 10,
                        get_js_file_url("production/formelements/password.js"),
                        $field
                    );
            }
        }
        return $next($request, $response, $delegate);
    }
}