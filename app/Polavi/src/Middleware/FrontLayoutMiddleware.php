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

        /***** HEADER ******/
        $response->addWidget(
            'header',
            'container',
            10,
            get_js_file_url("production/area.js"),
            ["id"=> "header", "className" => "header"]
        );
        $response->addWidget(
            'header_top',
            'header',
            10,
            get_js_file_url("production/area.js"),
            ["id"=> "header_top", "className" => "header-top"]
        );

        $response->addWidget(
            'header_middle',
            'header',
            20,
            get_js_file_url("production/cms/header.js"),
            ["id"=> "header_middle", "className" => "header-middle"]
        );

        $response->addWidget(
            'header_bottom',
            'header',
            30,
            get_js_file_url("production/area.js"),
            ["id"=> "header_bottom", "className" => "header-bottom"]
        );


        /***** CONTENT ******/
        $response->addWidget(
            'content',
            'container',
            20,
            get_js_file_url("production/area.js"),
            ["id"=> "content", "className" => "content"]
        );
        $response->addWidget(
            'content_top',
            'content',
            10,
            get_js_file_url("production/area.js"),
            ["id"=> "content_top", "className" => "content-top"]
        );

        $response->addWidget(
            'content_middle',
            'content',
            20,
            get_js_file_url("production/cms/content.js"),
            ["id"=> "content_middle", "className" => "content-middle container"]
        );

        $response->addWidget(
            'content_bottom',
            'content',
            30,
            get_js_file_url("production/area.js"),
            ["id"=> "content_bottom", "className" => "content-bottom"]
        );

        $response->addWidget(
            'left_column',
            'content_middle',
            10,
            get_js_file_url("production/area.js"),
            ["id"=> "left_column", "className"=> "col-3"]
        );

        $response->addWidget(
            'content_center',
            'content_middle',
            20,
            get_js_file_url("production/area.js"),
            ["id"=>"content_center", "className"=>"col-expand"]
        );

        $response->addWidget(
            'right_column',
            'content_middle',
            30,
            get_js_file_url("production/area.js"),
            ["id"=> "right_column", "className"=> "col-3"]
        );

        /***** FOOTER ******/
        $response->addWidget(
            'footer',
            'container',
            60,
            get_js_file_url("production/area.js"),
            ["id"=>"footer", "className" => "footer"]
        );
        $response->addWidget(
            'footer_top',
            'footer',
            10,
            get_js_file_url("production/area.js"),
            ["id"=>"footer_top", "className" => "footer-top"]
        );

        $response->addWidget(
            'footer_middle',
            'footer',
            20,
            get_js_file_url("production/area.js"),
            ["id"=>"footer_middle", "className" => "footer-middle container"]
        );

        $response->addWidget(
            'footer_bottom',
            'footer',
            30,
            get_js_file_url("production/area.js"),
            ["id"=>"footer_bottom", "className" => "footer-bottom"]
        );

        return $delegate;
    }
}