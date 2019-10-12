<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Sale;

use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Locale\Country;
use Similik\Services\Locale\Province;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;

class TaxMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $tax_class_table = get_mysql_table('tax_class');
        $tax_class = [];
        while ($row = $tax_class_table->fetch()) {
            $tax_class[] = [
                'value'=>$row['tax_class_id'],
                'text'=>$row['name']
            ];
        }
        $fields = [
            ['id'=>'sale_shipping_tax_class', 'name'=> 'sale_shipping_tax_class', 'type'=> 'select', 'label'=> 'Shipping tax class', 'options'=> $tax_class],
            ['id'=>'sale_tax_calculation_rounding', 'name'=> 'sale_tax_calculation_rounding', 'type'=> 'select', 'label'=> 'Tax Calculation Rounding', 'options'=>[['value'=>0, 'text'=>'Round'], ['value'=>1, 'text'=>'Round up'], ['value'=>-1, 'text'=>'Round down']]],
            ['id'=>'sale_tax_calculation_rounding_level', 'name'=> 'sale_tax_calculation_rounding_level', 'type'=> 'select', 'label'=> 'Tax calculation rounding level', 'options'=> [['value'=>0, 'text'=>'Item level'], ['value'=>1, 'text'=>'Order level']]]
        ];
        $data = $delegate->get('data');
        array_walk($fields, function(&$field) use($data) {
            if(isset($data[$field['id']]))
                $field['value'] = $data[$field['id']];
            else
                $field['value'] = "";
        });
        $response->addWidget(
            'sale_setting_tax_group',
            'sale_setting_form',
            20,
            get_js_file_url("production/form_group.js"),
            ["id"=>"sale_setting_tax_group", "name"=>"Tax"]
        );
        $response->addWidget(
            'sale_setting_sale_shipping_tax_class',
            'sale_setting_tax_group',
            10,
            get_js_file_url("production/formelements/text.js"),
            $fields[0]
        );
        $response->addWidget(
            'sale_setting_tax_default_address',
            'sale_setting_tax_group',
            20,
            get_js_file_url("production/setting/sale/default_address.js"),
            [
                "country"=>isset($data['sale_default_tax_country']) ? $data['sale_default_tax_country'] : '',
                "region"=>isset($data['sale_default_tax_region']) ? $data['sale_default_tax_region'] : '',
                "postcode"=>isset($data['sale_default_tax_postcode']) ? $data['sale_default_tax_postcode'] : '',
                "countries"=>Country::listCountriesV2(),
                "regions"=>Province::listStateV3(),
            ]
        );
        $response->addWidget(
            'sale_setting_sale_tax_calculation_rounding',
            'sale_setting_tax_group',
            30,
            get_js_file_url("production/formelements/select.js"),
            $fields[1]
        );
        $response->addWidget(
            'sale_setting_sale_tax_calculation_rounding_level',
            'sale_setting_tax_group',
            40,
            get_js_file_url("production/formelements/select.js"),
            $fields[2]
        );
        return $next($request, $response, $delegate);
    }
}