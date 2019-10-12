<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Tax\Middleware\Admin\TaxClass\Save;

use Similik\Http\Response;
use Similik\Services\Url;
use Similik\App;
use Symfony\Component\HttpFoundation\Session\Session;

class ResponseMiddleware
{
    /**
     * @param App $app
     * @param callable $next
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        if($delegate instanceof \Exception)
            $app->get(Session::class)->getFlashBag()->add('error', $delegate->getMessage());
        else
            $app->get(Session::class)->getFlashBag()->add('success', 'Tax class has been saved');
        $response->redirect(Url::buildUrl('tax/classes'));

        return $next($app, $response);
    }
}