<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Page\View;

use function Similik\get_config;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;

class NotFoundPageMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('notfound_page_content') || $response->getStatusCode() !== 404)
            return $delegate;

        $notFoundContent = get_config('general_notfound_page_content', 'The page you are looking for is not found');

        $response->addWidget(
            'notfound_page_content',
            'content',
            10,
            get_js_file_url("production/cms/page/cms_page.js", false),
            [
                "name"=> "Page Not Found",
                "content"=> $notFoundContent
            ]
        );
        return $delegate;
    }
}