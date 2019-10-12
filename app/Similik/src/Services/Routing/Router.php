<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services\Routing;

use FastRoute;
use function Similik\get_base_url;
use Similik\Services\Http\Request;
use Similik\Services\Routing\RouteParser as RouteParser;

class Router
{
    /** @var Request  */
    private $request;

    /** @var RouteParser  */
    private $parser;

    private $admin_routes = [];

    private $site_routes = [];

    public function __construct(Request $request, RouteParser $parser)
    {
        $this->request = $request;
        $this->parser = $parser;
    }

    public function addAdminRoute(string $name, $method, string $pattern, array $middleware)
    {
        if(isset($this->admin_routes[$name]))
            throw new \Error("{$name} route already existed");
        $this->admin_routes[$name] = [
            $method,
            $pattern == '/'? '/' . ADMIN_PATH : '/' . ADMIN_PATH . $pattern,
            $middleware
        ];
        return $this;
    }

    public function addSiteRoute(string $name, $method, string $pattern, array $middleware)
    {
        if(isset($this->site_routes[$name]))
            throw new \Error("{$name} route already existed");
        $this->site_routes[$name] = [
            $method,
            $pattern,
            $middleware
        ];
        return $this;
    }

    /**
     * @return FastRoute\Dispatcher
     */
    protected function routeInit()
    {
        if($this->request->isAdmin()) {
            $dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
                foreach($this->admin_routes as $name=>$route)
                    $r->addRoute($route[0], $route[1], $name);
            });
        } else {
            $dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
                foreach($this->site_routes as $name=>$route)
                    $r->addRoute($route[0], $route[1], $name);
            });
        }

        return $dispatcher;
    }

    public function dispatch()
    {
        $dispatcher = $this->routeInit();
        $routeInfo = $dispatcher->dispatch($this->request->getMethod(), $this->request->getPathInfo());

        switch ($routeInfo[0]) {
            case FastRoute\Dispatcher::NOT_FOUND:
                $this->request->attributes->set('_matched_route', 'not.found');
                return 404;
                break;
            case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
                return 405;
                break;
            case FastRoute\Dispatcher::FOUND:
                foreach ($routeInfo[2] as $key => $val) {
                    $this->request->attributes->set($key, $val);
                }
                $this->request->attributes->set('_matched_route', $routeInfo[1]);
                $routed_middleware = $this->request->isAdmin() ? $this->admin_routes[$routeInfo[1]][2] : $this->site_routes[$routeInfo[1]][2];
                $this->request->attributes->set('_routed_middleware', $routed_middleware);
                return 200;
                break;
            default:
                return 200;
        }
    }

    public function generateUrl(string $routeName, array $params = [], array $query = null) : string
    {
        $route = $this->site_routes[$routeName] ?? $this->admin_routes[$routeName] ?? null;

        if($route == null)
            throw new \RuntimeException(sprintf(
                'Cannot generate URI for route "%s"; route not found',
                $routeName
            ));

        $routes = $this->parser->parse($route[1]);
        $path = get_base_url();
        foreach ($routes as $part) {
            if (is_string($part)) {
                // Append the string
                $path .= $part;
                continue;
            }

            if(isset($part[2]) and (!isset($params[$part[0]]) or $params[$part[0]] === null))
                continue;

            if (! preg_match('~^' . $part[1] . '$~', (string) $params[$part[0]])) {
                throw new \LogicException(sprintf(
                    'Parameter value for [%s] did not match the regex `%s`',
                    $part[0],
                    $part[1]
                ));
            }

            $path .= $params[$part[0]];
        }

        if($query) {
            $queryString = http_build_query($query);
            return trim($path, '/') . "?" . $queryString;
        } else
            return trim($path, '/');
    }
}