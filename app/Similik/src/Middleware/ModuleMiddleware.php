<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\Event\Dispatcher;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
use Symfony\Component\EventDispatcher\GenericEvent;

class ModuleMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        $core_extensions = [
            'Catalog',
            'Cms',
            'Checkout',
            'PaypalExpress',
            'Tax',
            'ShippingLocation',
            'Promotion',
            'Sale',
            'User',
            'Setting',
            'Graphql'
        ];

        $eventDispatcher = $this->getContainer()->get(Dispatcher::class);
        $router = $this->getContainer()->get(Router::class);
        $app = $this->getContainer();
        foreach($core_extensions as $extension) {
            if(file_exists( MODULE_PATH . DS . $extension . DS . 'events.php'))
                include MODULE_PATH . DS . $extension . DS . 'events.php';

            if(file_exists( MODULE_PATH . DS . $extension . DS . 'routes.php'))
                include MODULE_PATH . DS . $extension . DS . 'routes.php';

            if(file_exists( MODULE_PATH . DS . $extension . DS . 'services.php'))
                include MODULE_PATH . DS . $extension . DS . 'services.php';
        }
        $eventDispatcher->dispatch('register.core.middleware', new GenericEvent());
    }
}