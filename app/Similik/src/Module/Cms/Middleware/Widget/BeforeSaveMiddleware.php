<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Widget;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class BeforeSaveMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == false)
            return $delegate;

        $data = $request->request->all();
        if(!isset($data['variables']['widget']['type']))
            return $delegate;

        $variables = $request->request->get('variables');
        $layout = [];
        foreach ($request->request->get('layout', []) as $key => $value)
            $layout[] = $key;
        $variables['widget']['display_setting'][] = ['key'=>'layout', 'value'=>json_encode($layout)];
        $area = [];
        foreach ($request->request->get('area', []) as $key => $value)
            $area[] = $key;
        $variables['widget']['display_setting'][] = ['key'=>'area', 'value'=>json_encode($area)];

        $setting = $variables['widget']['setting'] ?? [];
        $setting = array_map(function($val) {
            if(is_array($val['value']))
                return array_merge($val, ['value' => json_encode($val['value'], JSON_NUMERIC_CHECK)]);
            else
                return $val;
        }, $setting);
        $variables['widget']['setting'] = $setting;

        $request->request->set('variables', $variables);

        return $delegate;
    }
}