<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik;

use GraphQL\Executor\ExecutionResult;
use GuzzleHttp\Promise\Promise;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Similik\Middleware\AdminNavigationMiddleware;
use Similik\Middleware\CartInitMiddleware;
use Similik\Middleware\FrontNavigationMiddleware;
use Similik\Middleware\GraphQLExecuteMiddleware;
use Similik\Middleware\PromiseWaiterMiddleware;
use Similik\Middleware\SaveCartMiddleware;
use Similik\Module\Graphql\Services\ExecutionPromise;
use Similik\Services\Db\Processor;
use Similik\Services\Di\Container;
use Similik\Services\Event\EventDispatcher;
use Similik\Services\Helmet;
use Similik\Services\HtmlDocument;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\ConfigMiddleware;
use Similik\Middleware\SessionMiddleware;
use Similik\Middleware\RoutingMiddleware;
use Similik\Middleware\AuthenticateMiddleware;
use Similik\Middleware\InitHtmlMiddleware;
use Similik\Middleware\HandlerMiddleware;
use Similik\Middleware\AdminLayoutMiddleware;
use Similik\Middleware\FrontLayoutMiddleware;
use Similik\Middleware\AlertMiddleware;
use Similik\Middleware\ResponseMiddleware;
use Similik\Services\MiddlewareManager;
use Similik\Services\PromiseWaiter;
use Similik\Services\Routing\RouteParser;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\NativeFileSessionHandler;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;

class App
{
    /*@var Container $container*/
    private $container;

    public function __construct()
    {
        $this->container = new Container();
    }

    public function registerDefaultService()
    {
        the_container($this->container)->set(Router::class, function($c) {
            return new Router($c[Request::class], new RouteParser());
        });

        the_container()->set(Processor::class, function($c) {
            $processor = new Processor();
            return $processor;
        });

        the_container()[Session::class] = function($c) {
            return new Session(new NativeSessionStorage([], new NativeFileSessionHandler()));
        };

        the_container()[Request::class] = function($c) {
            return Request::createFromGlobals();
        };

        the_container()[Helmet::class] = function($c) {
            return new Helmet();
        };

        the_container()[HtmlDocument::class] = function($c) {
            return new HtmlDocument($c[Request::class], $c[Helmet::class]);
        };

        the_container()[Response::class] = function($c) {
            return new Response();
        };

        the_container()[EventDispatcher::class] = function($c) {
            return new EventDispatcher();
        };

        the_container()[ExecutionPromise::class] = function(Container $c) {
            $promise = new Promise(function() use (&$promise, $c) {
                if($c->offsetExists(ExecutionResult::class))
                    $promise->resolve($c->get(ExecutionResult::class));
                else
                    $promise->reject('Graphql execution result is not defined');
            });

            return $promise;
        };

        the_container()[PromiseWaiter::class] = function($c) {
            return new PromiseWaiter();
        };
        // Log
        the_container()[Logger::class] = function($c) {
            $logger = new Logger('logger');
            $logger->pushHandler(new StreamHandler(LOG_PATH . '/app.log', Logger::DEBUG));

            return $logger;
        };
    }

    protected function loadModule()
    {
        $core_extensions = [
            'Catalog',
            'Customer',
            'Cms',
            'Checkout',
            'Cod',
            'FlatRate',
            'PaypalExpress',
            'Tax',
            'ShippingLocation',
            'Discount',
            'Order',
            'User',
            'Setting',
            'SendGrid',
            'Graphql'
        ];

        // TODO: Refactor this
        $eventDispatcher = $this->container->get(EventDispatcher::class);
        $router = $this->container->get(Router::class);
        $container = $this->container;
        foreach($core_extensions as $extension) {
            if(file_exists( MODULE_PATH . DS . $extension . DS . 'events.php'))
                (function() use ($extension, $eventDispatcher, $container) {
                    include MODULE_PATH . DS . $extension . DS . 'events.php';
                })();

            if(file_exists( MODULE_PATH . DS . $extension . DS . 'routes.php'))
                (function() use ($extension, $router, $container) {
                    include MODULE_PATH . DS . $extension . DS . 'routes.php';
                })();

            if(file_exists( MODULE_PATH . DS . $extension . DS . 'services.php'))
                (function() use ($extension, $container) {
                    include MODULE_PATH . DS . $extension . DS . 'services.php';
                })();
        }
        subscribe('after.load.module', function() {}, 0 , $eventDispatcher);

        dispatch_event('after.load.module', [], $eventDispatcher);
    }

    public function run()
    {
        $this->loadModule();
        $middleware = [
            0 => ConfigMiddleware::class,
            10 => SessionMiddleware::class,
            20 => RoutingMiddleware::class,
            30 => AuthenticateMiddleware::class,

            //WidgetMiddleware::class,
            35 => CartInitMiddleware::class,
            //MiniCartMiddleware::class,
            40 => HandlerMiddleware::class,
            60 => InitHtmlMiddleware::class,
            70 => SaveCartMiddleware::class,
            75 => PromiseWaiterMiddleware::class,
            80 => GraphQLExecuteMiddleware::class,
            90 => AdminLayoutMiddleware::class,
            100 => FrontLayoutMiddleware::class,
            110 => AdminNavigationMiddleware::class,
            120 => FrontNavigationMiddleware::class,
            140 => AlertMiddleware::class,
            150 => ResponseMiddleware::class
        ];

        $mm = new MiddlewareManager($this->container, $middleware);

        dispatch_event('register.core.middleware', [$mm]);
        $mm->run();
    }
}