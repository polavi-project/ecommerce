<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;


use function Polavi\get_js_file_url;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class FrontLayoutMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin())
            return $delegate;
        if($request->getMethod() != 'GET')
            return $delegate;
        if(
            $request->attributes->get('_matched_route') == 'graphql.api'
        )
            return $delegate;

        $response->addWidget(
            'container',
            'wrapper',
            0,
            get_js_file_url("production/area.js"),
            ["id"=> "container", "className" => "container-wrapper"]
        );

        $response->addWidget(
            'header_top',
            'container',
            0,
            get_js_file_url("production/area.js"),
            ["id"=> "header_top", "className" => "header-top"]
        );

        $response->addWidget(
            'header',
            'container',
            10,
            get_js_file_url("production/cms/header.js"),
            ["id"=> "header", "className" => "header"]
        );

        $response->addWidget(
            'header_bottom',
            'container',
            20,
            get_js_file_url("production/area.js"),
            ["id"=> "header_bottom", "className" => "header-top"]
        );

        $response->addWidget(
            'content_top',
            'container',
            30,
            get_js_file_url("production/area.js"),
            ["id"=> "content_top", "className" => "content-top"]
        );

        $response->addWidget(
            'content',
            'container',
            40,
            get_js_file_url("production/cms/content.js"),
            ["id"=> "content", "className" => "content container"]
        );

        $response->addWidget(
            'content_bottom',
            'container',
            50,
            get_js_file_url("production/area.js"),
            ["id"=> "content_bottom", "className" => "content-bottom"]
        );

        $response->addWidget(
            'left_column',
            'content',
            10,
            get_js_file_url("production/area.js"),
            ["id"=> "left_column", "className"=> "col-3"]
        );

        $response->addWidget(
            'content_center',
            'content',
            20,
            get_js_file_url("production/area.js"),
            ["id"=>"content_center", "className"=>"col-expand"]
        );

        $response->addWidget(
            'right_column',
            'content',
            30,
            get_js_file_url("production/area.js"),
            ["id"=> "right_column", "className"=> "col-3"]
        );

        $response->addWidget(
            'footer_top',
            'container',
            60,
            get_js_file_url("production/area.js"),
            ["id"=>"footer_top", "className" => "footer-top"]
        );

        $response->addWidget(
            'footer',
            'container',
            70,
            get_js_file_url("production/area.js"),
            ["id"=>"footer", "className" => "footer"]
        );

        $response->addWidget(
            'footer_bottom',
            'container',
            80,
            get_js_file_url("production/area.js"),
            ["id"=>"footer_bottom", "className" => "footer-bottom"]
        );

        return $delegate;
    }
}