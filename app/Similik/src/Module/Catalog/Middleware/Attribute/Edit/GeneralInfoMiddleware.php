<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Edit;

use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Symfony\Component\EventDispatcher\GenericEvent;

class GeneralInfoMiddleware extends MiddlewareAbstract
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
        if($response->hasWidget('attribute_edit_general_group'))
            return $next($request, $response, $delegate);
        $fields = [
            ["id"=>'attribute_code', "name"=> "attribute_code", "type"=> "text", "label"=> __("Attribute code"), "validation_rules"=>["required"]],
            ["id"=>'attribute_name', "name"=> "attribute_name", "type"=> "text", "label"=> __("Attribute name")],
            ["id"=>'type', "name"=> "type", "type"=> "select", "label"=> __("Attribute type"), "options"=>[
                ['value'=>'text', 'text'=>'Text'],
                ['value'=>'textarea', 'text'=>'Textarea'],
                ['value'=>'select', 'text'=>'Select'],
                ['value'=>'multiselect', 'text'=>'Multiselect'],
                ['value'=>'date', 'text'=>'Date'],
                ['value'=>'datetime', 'text'=>'Datetime']
            ]],
            ["id"=>'is_required',"name"=> "is_required", "type"=> "select", "label"=> __("Is required?"), "options"=>[['value'=>0, 'text'=>'No'], ['value'=>1, 'text'=>'Yes']]],
            ["id"=>'display_on_frontend',"name"=> "display_on_frontend", "type"=> "select", "label"=> __("Display on frontend"), "options"=>[['value'=>0, 'text'=>'No'], ['value'=>1, 'text'=>'Yes']]],
            ["id"=>'sort_order',"name"=> "sort_order", "type"=> "text", "label"=> __("Sort order")]
        ];
        $general_data = $delegate->get('attribute');
        array_walk($fields, function(&$field) use($general_data) {
            if(isset($general_data[$field['name']]))
                $field['value'] = $general_data[$field['name']];
            else
                $field['value'] = "";
        });
        $event = new GenericEvent(null, [$fields]);
        dispatch_event('register_attribute_general_field', $event);
        $response->addWidget(
            'attribute_edit_general_group',
            'attribute_edit_form',
            10,
            Helper::getJsFileUrl("production/form_group.js"),
            ["id"=>"attribute_edit_general_group", "name"=>"General"]
        );
        foreach ($event->getArgument(0) as $key =>$field) {
            switch ($field['type']) {
                case "text":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/text.js"),
                        $field
                    );
                    break;
                case "datetime":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/datetime.js"),
                        $field
                    );
                    break;
                case "date":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/date.js"),
                        $field
                    );
                    break;
                case "select":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/select.js"),
                        $field
                    );
                    break;
                case "multiselect":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/multiselect.js"),
                        $field
                    );
                    break;
                case "textarea":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/textarea.js"),
                        $field
                    );
                    break;
                case "hidden":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/hidden.js"),
                        $field
                    );
                    break;
                case "password":
                    $response->addWidget(
                        'attribute_edit_general_' . $field['name'],
                        'attribute_edit_general_group',
                        $key * 10,
                        Helper::getJsFileUrl("production/formelements/password.js"),
                        $field
                    );
            }
        }
        return $next($request, $response, $delegate);
    }
}
