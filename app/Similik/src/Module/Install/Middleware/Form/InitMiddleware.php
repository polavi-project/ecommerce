<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Install\Middleware\Form;


use function Similik\get_base_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class InitMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response)
    {
        if(file_exists(CONFIG_PATH . DS . 'config.php')) {
            $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('homepage'));
            return $redirect->send();
        }

        return null;
    }
}