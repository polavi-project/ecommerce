<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Middleware\Page\View;

use function Polavi\get_config;
use function Polavi\get_default_language_Id;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Response;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;

class NotFoundPageMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->getStatusCode()!== 404)
            return $delegate;

        $this->getContainer()->get(Helmet::class)->setTitle('Page not found');
        return $delegate;
    }
}