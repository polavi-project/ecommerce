<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi;

use GraphQL\Executor\ExecutionResult;
use GuzzleHttp\Promise\Promise;
use function GuzzleHttp\Promise\settle;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Polavi\Middleware\AdminNavigationMiddleware;
use Polavi\Middleware\CartInitMiddleware;
use Polavi\Middleware\CustomerAuthenticateMiddleware;
use Polavi\Middleware\PromiseWaiterMiddleware;
use Polavi\Middleware\SaveCartMiddleware;
use Polavi\Middleware\UserAuthenticateMiddleware;
use Polavi\Module\Graphql\Services\ExecutionPromise;
use Polavi\Services\Db\Configuration;
use Polavi\Services\Db\Processor;
use Polavi\Services\Di\Container;
use Polavi\Services\Event\EventDispatcher;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\ConfigMiddleware;
use Polavi\Middleware\SessionMiddleware;
use Polavi\Middleware\RoutingMiddleware;
use Polavi\Middleware\HandlerMiddleware;
use Polavi\Middleware\AdminLayoutMiddleware;
use Polavi\Middleware\FrontLayoutMiddleware;
use Polavi\Middleware\AlertMiddleware;
use Polavi\Middleware\ResponseMiddleware;
use Polavi\Services\MiddlewareManager;
use Polavi\Services\PromiseWaiter;
use Polavi\Services\Routing\RouteParser;
use Polavi\Services\Routing\Router;
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

    /**
     * This function registers some default services
     */
    public function registerDefaultService()
    {
        the_container($this->container)->set(Router::class, function($c) {
            return new Router($c[Request::class], new RouteParser());
        });

        the_container()->set(Processor::class,  $this->container->factory(function() {
            return new Processor(
                $this->container->get(Configuration::class),
                $this->container->get(EventDispatcher::class)
            );
        }));

        the_container()[Session::class] = function($c) {
            return new Session(new NativeSessionStorage([], new NativeFileSessionHandler()));
        };

        the_container()[Request::class] = function($c) {
            return Request::createFromGlobals();
        };

        the_container()[Helmet::class] = function($c) {
            return new Helmet();
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
            $promise = new PromiseWaiter(function() use(&$promise) {
                $p = settle($promise->getPromises());
                $p->wait();
                $p->then(function($result) use (&$promise) {
                    $promise->resolve($result);
                });
            });

            return $promise;
        };
        // Log
        the_container()[Logger::class] = function($c) {
            $logger = new Logger('system');
            $logger->pushHandler(new StreamHandler(LOG_PATH . '/system.log', Logger::DEBUG));

            return $logger;
        };
    }

    protected function loadModule()
    {
        $modules = ["Migration"];
        if(file_exists(CONFIG_PATH . DS . 'config.php')) {
            $table = _mysql()->getTable('migration');
            while ($row = $table
                ->where('status', '=', 1)
                ->fetch()) {
                $modules[] = $row['module'];
            }
        }

        $eventDispatcher = $this->container->get(EventDispatcher::class);
        $router = $this->container->get(Router::class);
        $container = $this->container;
        $container->set("moduleLoading", true);
        foreach($modules as $module) {
            if(!file_exists(COMMUNITY_MODULE_PATH . DS . $module) && !file_exists(MODULE_PATH . DS . $module))
                continue;
            if(file_exists( MODULE_PATH . DS . $module . DS . 'services.php'))
                (function() use ($module, $container) {
                    include MODULE_PATH . DS . $module . DS . 'services.php';
                })();

            if(file_exists( MODULE_PATH . DS . $module . DS . 'events.php'))
                (function() use ($module, $eventDispatcher) {
                    include MODULE_PATH . DS . $module . DS . 'events.php';
                })();

            if(file_exists( MODULE_PATH . DS . $module . DS . 'routes.php'))
                (function() use ($module, $router, $container) {
                    include MODULE_PATH . DS . $module . DS . 'routes.php';
                })();
        }
        $container->offsetUnset("moduleLoading");
        dispatch_event('after.load.module', []);
    }

    protected function prepareToStart()
    {
        if(file_exists(CONFIG_PATH . DS . 'config.php')) {
            $configuration = require_once './config/config.php';
            $this->container->set(Configuration::class, function() use($configuration) {
                return new Configuration(
                    $configuration["database"],
                    $configuration["driver"],
                    $configuration["host"],
                    $configuration["username"],
                    $configuration["password"]
                );
            });
        } else if(file_exists(CONFIG_PATH . DS . 'config.tmp.php')) {
            $configuration = require_once './config/config.tmp.php';
            $this->container->set(Configuration::class, function() use($configuration) {
                return new Configuration(
                    $configuration["database"],
                    $configuration["driver"],
                    $configuration["host"],
                    $configuration["username"],
                    $configuration["password"]
                );
            });
        }

        if(!strpos($_SERVER['REQUEST_URI'], 'install') and !file_exists(CONFIG_PATH . DS . 'config.php')) {
            $redirect = new \Symfony\Component\HttpFoundation\RedirectResponse(\Polavi\get_base_url() . '/install');
            return $redirect->send();
        }

        return true;
    }

    /**
     * This is application trigger. Run the app
     */
    public function run()
    {
        $this->prepareToStart();
        $this->loadModule();
        if(file_exists(CONFIG_PATH . DS . 'config.php'))
            $middleware = [
                0 => ConfigMiddleware::class,
                10 => SessionMiddleware::class,
                20 => RoutingMiddleware::class,
                30 => CustomerAuthenticateMiddleware::class,
                35 => UserAuthenticateMiddleware::class,
                40 => CartInitMiddleware::class,
                50 => HandlerMiddleware::class,
                60 => PromiseWaiterMiddleware::class,
                70 => SaveCartMiddleware::class,
                80 => AdminLayoutMiddleware::class,
                90 => FrontLayoutMiddleware::class,
                100 => AdminNavigationMiddleware::class,
                110 => AlertMiddleware::class,
                120 => ResponseMiddleware::class
            ];
        else
            $middleware = [
                SessionMiddleware::class,
                RoutingMiddleware::class,
                HandlerMiddleware::class,
                FrontLayoutMiddleware::class,
                ResponseMiddleware::class
            ];

        $mm = new MiddlewareManager($this->container, $middleware);
        dispatch_event('register.core.middleware', [$mm]);

        $mm->run();
    }
}