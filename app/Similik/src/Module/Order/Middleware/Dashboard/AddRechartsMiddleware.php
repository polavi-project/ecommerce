<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Middleware\Dashboard;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\HtmlDocument;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class AddRechartsMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $this->getContainer()->get(HtmlDocument::class)->addJsFile("https://unpkg.com/recharts@1.8.5/umd/Recharts.min.js");

        return $delegate;
    }
}