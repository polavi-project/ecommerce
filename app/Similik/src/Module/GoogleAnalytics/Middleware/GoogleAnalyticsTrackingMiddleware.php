<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\GoogleAnalytics\Middleware;


use function Similik\get_config;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class GoogleAnalyticsTrackingMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $code = get_config('general_google_analytics', null);
        if(
            !$request->isAjax() &&
            $request->attributes->get('_matched_route') != 'graphql.api' &&
            $request->attributes->get('_matched_route') != 'admin.graphql.api' &&
            $request->isMethod("GET") &&
            !$request->isAdmin() &&
            $code
        ) {
            $this
                ->getContainer()
                ->get(Helmet::class)
                ->addHtmlBeforeCloseHead("<script> var google_analytics_code = \"{$code}\";</script>")
                ->addHtmlBeforeCloseHead("<script async src='https://www.googletagmanager.com/gtag/js?id={$code}'></script>")
                ->addHtmlBeforeCloseHead("<script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag(\"js\",new Date),gtag(\"config\",\"{$code}\")</script>");
        }

        return $delegate;
    }
}