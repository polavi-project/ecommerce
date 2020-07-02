<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services;

use function Polavi\dispatch_event;
use Polavi\Middleware\ConfigMiddleware;
use Polavi\Middleware\ResponseMiddleware;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class MiddlewareManager
{
    /**@var Container $container; */
    private $container;

    private $middleware = [];

    private $removedMiddleware = [];

    private $middlewareLocked = false;

    private static $delegates = [];

    public function __construct(Container $container, array $middleware = [])
    {
        $this->container = $container;
        $isCore = false;
        foreach ($middleware as $key => $m) {
            if($m == ConfigMiddleware::class)
                $isCore = true;
            $this->registerMiddleware($m, $isCore == false ? ($key+1) * 10 : $key);
        }
        if($container->get(Request::class)->attributes->get('_matched_route'))
            dispatch_event('register.' . $container->get(Request::class)->attributes->get('_matched_route') . '.middleware', [$this]);
    }

    public function registerMiddleware( $middleware, int $position) : self
    {
        if($this->middlewareLocked == true)
            throw new \Error('Can not add middleware once application is running');

        if(is_string($middleware))
            $middleware = new $middleware();
        if(!$middleware instanceof MiddlewareAbstract)
            throw new \InvalidArgumentException('Invalid middleware');

        $this->middleware[$position][] = $middleware;

        return $this;
    }

    public function registerMiddlewareBefore( $before, $middleware) : self
    {
        if($this->middlewareLocked == true)
            throw new \Error('Can not add middleware once application is running');

        if(is_string($middleware))
            $middleware = new $middleware();
        if(!$middleware instanceof MiddlewareAbstract)
            throw new \InvalidArgumentException('Invalid middleware');

        foreach ($this->middleware as $key => $m) {
            foreach ($m as $k=>$v) {
                if(get_class($v) == $before) {
                    array_splice($m, $k, 0, [$middleware]);
                    $this->middleware[$key] = $m;
                    break;
                }
            }
        }
        return $this;
    }

    public function registerMiddlewareAfter( $after, $middleware) : self
    {
        if($this->middlewareLocked == true)
            throw new \Error('Can not add middleware once application is running');

        if(is_string($middleware))
            $middleware = new $middleware();
        if(!$middleware instanceof MiddlewareAbstract)
            throw new \InvalidArgumentException('Invalid middleware');

        foreach ($this->middleware as $key => $m) {
            foreach ($m as $k=>$v) {
                if(get_class($v) == $after) {
                    array_splice($m, $k+1, 0, [$middleware]);
                    $this->middleware[$key] = $m;
                    break;
                }
            }
        }
        return $this;
    }

    public function removeMiddleware(string $className) : self
    {
        if($this->middlewareLocked == true)
            throw new \Error('Can not remove middleware once application is running');

        $this->removedMiddleware[] = $className;

        return $this;
    }

    public function run()
    {
        $l = [];
        $m = [];
        krsort($this->middleware);
        $log = [];

        foreach ($this->middleware as $middleware) {
            krsort($middleware);
            foreach ($middleware as $v) {
                $log[] = get_class($v);
                $l[] = $v;
            }
        }
        foreach ($l as $callable) {
            $callable->setContainer($this->container);
            $next = end($m);
            if($next == null)
                $next = function(Request $request, Response $response, $delegate = null) use ($callable) {
                    if($callable instanceof ResponseMiddleware)
                        dispatch_event("core_middleware_ended", []);
                    else
                        dispatch_event("route_middleware_ended", []);
                };
            $m[] = function (Request $request, Response $response, $delegate = null) use ($callable, $next) {
                if($delegate instanceof Response) {
                    $response->send($this->container->get(Request::class)->isAjax(), $response->getStatusCode());
                    exit();
                } else {
                    if(!in_array(get_class($callable), $this->removedMiddleware)) {
                        dispatch_event('before_execute_' . strtolower(str_replace('\\', '_', get_class($callable))), [$this->container]);
                        $delegate = call_user_func($callable, $request, $response, $delegate);
                        self::$delegates[get_class($callable)] = $delegate;
                    }
                    call_user_func($next, $request, $response, $delegate);
                }
            };
        }

        $this->middlewareLocked = true;
        $startPoint = end($m);

        return call_user_func($startPoint, $this->container[Request::class], $this->container[Response::class]);
    }

    public static function getDelegate($className, $defaultValue = null)
    {
        return self::$delegates[$className] ?? $defaultValue;
    }

    public static function hasDelegate($className)
    {
        return isset(self::$delegates[$className]);
    }
}