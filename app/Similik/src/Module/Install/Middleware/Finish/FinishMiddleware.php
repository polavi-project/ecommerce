<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Install\Middleware\Finish;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
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
        require_once CONFIG_PATH . DS . 'config.tmp.php';
        $fileSystem = new Filesystem();
        $fileSystem->rename(CONFIG_PATH . DS . 'config.tmp.php', CONFIG_PATH . DS . 'config.php', true);

        $response->addData('success', 1)->addData('message', 'Done')->notNewPage();

        return $response;
    }
}