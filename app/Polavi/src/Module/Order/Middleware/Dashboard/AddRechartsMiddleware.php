<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Middleware\Dashboard;


use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class AddRechartsMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->isAdmin() == true)
            $this->getContainer()->get(Helmet::class)->addScript(['src'=>get_js_file_url('production/recharts.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 6);

        return $delegate;
    }
}