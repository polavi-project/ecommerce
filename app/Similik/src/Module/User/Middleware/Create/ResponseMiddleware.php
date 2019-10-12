<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Tax\Middleware\Admin\TaxClass\Create;

use Similik\Http\Response;
use Similik\Services\Url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\View\Head;
use Similik\App;
use Similik\Services\Renderer;
use Similik\View\Body;
use Symfony\Component\HttpFoundation\Session\Session;

class ResponseMiddleware extends Renderer extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        if($delegate instanceof \Exception) {
            $app->get(Session::class)->getFlashBag()->add('error', $delegate->getMessage());
            $response->redirect(Url::buildUrl('tax/classes'));
            return $next($app, $response);
        }

        $app[Head::class]->setTitle('Create new tax class');
        $content = $this->setApplication($app)->setTemplate('taxclass/edit.phtml')->getHtml(['form_data'=>json_encode($delegate)]);
        $app[Body::class]->setContent($content);

        return $next($app);
    }
}