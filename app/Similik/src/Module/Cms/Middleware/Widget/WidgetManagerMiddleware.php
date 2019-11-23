<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Widget;


use function Similik\_mysql;
use function Similik\dispatch_event;
use function Similik\generate_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class WidgetManagerMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $types = [])
    {
        $types[] = ['code' => 'text', 'name' => 'Text'];
        $types[] = ['code' => 'menu', 'name' => 'Menu'];

        dispatch_event('add_widget_type', [&$types]);
        $props = [
            "types" => $types,
            "retrieveListUrl" => generate_url('admin.graphql.api'),
            "typeRequestUrl" => generate_url('widget.grid')
        ];
        if($request->attributes->get('type')) {
            $props['defaultFilter'] = [
                [
                    'key' => 'type',
                    'operator' => '=',
                    'value' => $request->attributes->get('type')
                ]
            ];
            $props['selectedType'] = $request->attributes->get('type');
        }
        if($request->attributes->get('type') and $request->query->get('id')) {
            $conn = _mysql();
            $widget = $conn->getTable('cms_widget')
                ->where('cms_widget_id', '=', $request->query->get('id'))
                ->andWhere('type', '=', $request->attributes->get('type'))
                ->fetchOneAssoc();
            if($widget)
                $props['showEdit'] = 1;
        }
        $this->getContainer()->get(Helmet::class)->setTitle("Widgets");
        $response->addWidget(
            'widgets',
            'content',
            20,
            get_js_file_url("production/cms/widget/widgets.js", true),
            $props
        );
    }
}