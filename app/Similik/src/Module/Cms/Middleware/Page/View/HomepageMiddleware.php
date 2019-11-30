<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Page\View;

use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;

class HomepageMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> <<< QUERY
                    {
                        cms_page (id: 1 language:{$request->get('language', get_default_language_Id())}) {
                            cms_page_id
                            layout
                            name
                            content
                        }
                    }
QUERY

            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['cms_page'])) {
                    $response->addWidget(
                        'cms_page_content',
                        'content',
                        31,
                        get_js_file_url("production/cms/page/cms_page.js", false),
                        $result->data['cms_page']
                    );
                }
            });

        return $delegate;
    }
}