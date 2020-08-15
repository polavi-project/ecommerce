<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\GoogleAnalytics\Middleware;


use function Polavi\get_config;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class GoogleAnalyticsTrackingMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $code = get_config('general_google_analytics', null);
        if (
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