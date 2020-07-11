<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Middleware\Page\View;

use function Polavi\_mysql;
use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_current_language_id;
use function Polavi\get_default_language_Id;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Response;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;

class ViewMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('cms_page_view'))
            return $delegate;

        if($request->attributes->get('slug'))
            $page = _mysql()->getTable('cms_page')
                ->leftJoin('cms_page_description', null, [
                    [
                        'column'      => "cms_page_description.language_id",
                        'operator'    => "=",
                        'value'       => get_current_language_id(),
                        'ao'          => 'and',
                        'start_group' => null,
                        'end_group'   => null
                    ]
                ])
                ->where('cms_page_description.url_key', '=', $request->attributes->get('slug'))
                ->fetchOneAssoc();
        else
            $page = _mysql()->getTable('cms_page')
                ->leftJoin('cms_page_description', null, [
                    [
                        'column'      => "cms_page_description.language_id",
                        'operator'    => "=",
                        'value'       => get_current_language_id(),
                        'ao'          => 'and',
                        'start_group' => null,
                        'end_group'   => null
                    ]
                ])
                ->where('cms_page.cms_page_id', '=', $request->attributes->get('id'))
                ->fetchOneAssoc();

        if(!$page) {
            $request->attributes->set('_matched_route', 'not.found');
            $response->setStatusCode(404);
            return $response;
        }
        $request->attributes->set('id', $page['cms_page_id']);
        $this->getContainer()->get(Helmet::class)->setTitle($page['meta_title'])
            ->addMeta([
                'name'=> 'description',
                'content' => $page['meta_description']
            ]);
        $response->addState('currentPage', 'cmsPage')->addState('cmsPageId', $page['cms_page_id']);

        $response->addWidget(
            'cms_page_view',
            'content',
            10,
            get_js_file_url("production/cms/page/cms_page.js", false),
            [
                "id" => $page['cms_page_id'],
                "name" => $page['name'],
                "content" => $page['content'],
            ]
        );
        return $delegate;
    }
}