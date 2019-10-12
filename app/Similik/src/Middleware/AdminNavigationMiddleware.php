<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;


use function Similik\get_js_file_url;
use Similik\Module\Cms\Services\NavigationManager;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class AdminNavigationMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$request->isAdmin() || $request->attributes->get('_matched_route') == 'admin.login')
            return $delegate;

        $response->addWidget(
            'admin_navigation',
            'menu',
            0,
            get_js_file_url("production/navigation.js", true),
            [
                "items"=> array_values($this->getContainer()->get(NavigationManager::class)->getItems())
            ]
        );

        return true;
    }
}