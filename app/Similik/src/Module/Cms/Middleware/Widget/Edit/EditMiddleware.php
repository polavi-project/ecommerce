<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Widget\Edit;


use function Similik\create_mutable_var;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class EditMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->attributes->get('id')) {
            $this->getContainer()->get(Helmet::class)->setTitle("Edit a widget");
        } else {
            $this->getContainer()->get(Helmet::class)->setTitle("Create a widget");
        }

        $response->addWidget(
            'widget_edit_form_wrapper',
            'content',
            10,
            get_js_file_url("production/cms/widget/edit/widget_edit.js", true),
            [
                "widgetId"=> $request->attributes->get('id'),
                "id"=> "widget_edit_form_wrapper",
                "types"=> create_mutable_var("widget_types", []),
                "selectedType"=> $request->attributes->get('type', "")
            ]
        );

        return $delegate;
    }
}