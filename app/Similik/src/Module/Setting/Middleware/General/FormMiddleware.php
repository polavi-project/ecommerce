<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\General;

use function Similik\_mysql;
use function Similik\dispatch_event;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Locale\Country;
use Similik\Services\Locale\Currency;
use Similik\Services\Locale\Language;
use Similik\Services\Locale\Timezone;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    const FORM_ID = 'general_setting_form';

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getMethod() == 'POST')
            return $delegate;
        $fields = [
            ['id'=>'general_store_name', 'formId'=> self::FORM_ID, 'name'=> 'general_store_name', 'type'=> 'text', 'label'=> "Store name", 'validation_rules'=>['notEmpty']],
            ['id'=>'general_store_contact_telephone', 'formId'=> self::FORM_ID, 'name'=> 'general_store_contact_telephone', 'type'=> 'text', 'label'=> "Store contact telephone", 'validation_rules'=>['notEmpty']],
            ['id'=>'general_store_contact_address', 'formId'=> self::FORM_ID, 'name'=> 'general_store_contact_address', 'type'=> 'text', 'label'=> "Store contact address", 'validation_rules'=>['notEmpty']],
            ['id'=>'general_store_country', 'formId'=> self::FORM_ID, 'name'=> 'general_store_country', 'type'=> 'select', 'label'=> "Country", 'options'=>Country::listCountriesV2()],
            ['id'=>'general_timezone', 'formId'=> self::FORM_ID, 'name'=> 'general_timezone', 'type'=> 'select', 'label'=> "Timezone", 'options'=>Timezone::listTimezonesV2()],
            ['id'=>'general_currency', 'formId'=> self::FORM_ID, 'name'=> 'general_currency', 'type'=> 'select', 'label'=> "Currency", 'options'=>Currency::listCurrenciesV2()],
            ['id'=>'general_languages', 'formId'=> self::FORM_ID, 'name'=> 'general_languages[]', 'type'=> 'multiselect', 'label'=> "Display languages", 'options'=>Language::listLanguagesV3(), 'validation_rules'=>['notEmpty']],
            ['id'=>'general_default_language', 'formId'=> self::FORM_ID, 'name'=> 'general_default_language', 'type'=> 'select', 'label'=> "Default language", 'validation_rules'=>['notEmpty'], 'options'=>Language::listLanguagesV3()],
            ['id'=>'general_allow_countries', 'formId'=> self::FORM_ID, 'name'=> 'general_allow_countries', 'type'=> 'select', 'label'=> "Delivery country", 'validation_rules'=>['notEmpty'], 'options'=>Country::listCountriesV2()],
        ];
        dispatch_event('filter_general_setting_fields', [&$fields]);

        $response->addWidget(
            'general_setting_form',
            'content',
            10,
            get_js_file_url("production/setting/general/form.js", true),
            ["id"=>"general_setting_form", "action"=>$this->getContainer()->get(Router::class)->generateUrl('setting.general')]
        );
        $stm = _mysql()
            ->executeQuery("SELECT * FROM `setting`
WHERE language_id = :language
AND `name` LIKE 'general_%'
UNION 
SELECT * FROM `setting`
WHERE `name` NOT IN (SELECT `name` FROM `setting` WHERE language_id = :language AND `name` LIKE 'general_%') 
AND language_id = 0
AND `name` LIKE 'general_%'", ['language' => $request->attributes->get('language', get_default_language_Id())!= get_default_language_Id() ? $request->attributes->get('language', get_default_language_Id()) : 0]);

        while ($row = $stm->fetch()) {
            foreach ($fields as $key =>$field)
                if($row['name'] == $field['id']) {
                    if($row['json'] == 1)
                        $fields[$key]['value'] = json_decode($row['value'], true);
                    else
                        $fields[$key]['value'] = $row['value'];
                }
        }

        foreach ($fields as $key =>$field) {
            switch ($field['type']) {
                case "text":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/text.js", true),
                        $field
                    );
                    break;
                case "datetime":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/datetime.js", true),
                        $field
                    );
                    break;
                case "date":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/date.js", true),
                        $field
                    );
                    break;
                case "select":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/select.js", true),
                        $field
                    );
                    break;
                case "multiselect":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/multiselect.js", true),
                        $field
                    );
                    break;
                case "textarea":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/textarea.js", true),
                        $field
                    );
                    break;
                case "hidden":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/hidden.js", true),
                        $field
                    );
                    break;
                case "password":
                    $response->addWidget(
                        'general_setting_form_' . $field['name'],
                        'general_setting_form_inner',
                        $key * 10,
                        get_js_file_url("production/form/fields/password.js", true),
                        $field
                    );
            }
        }
        return null;
    }
}