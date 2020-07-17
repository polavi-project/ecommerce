<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Finish;


use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\RedirectResponse;

class FinishMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        if(!file_exists(CONFIG_PATH . DS . 'config.tmp.php')) {
            $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('homepage'));
            return $redirect->send();
        }
        $fileSystem = new Filesystem();
        $fileSystem->rename(CONFIG_PATH . DS . 'config.tmp.php', CONFIG_PATH . DS . 'config.php', true);

        $response->addData('success', 1)->addData('message', 'Done')->notNewPage();

        return $response;
    }
}