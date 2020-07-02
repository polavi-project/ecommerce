<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Middleware;

use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\MiddlewareManager;

abstract class MiddlewareAbstract
{
    /**@var Container $container */
    private $container;

    public function setContainer(Container $container)
    {
        $this->container = $container;
    }

    abstract public function __invoke(Request $request, Response $response);

    /**
     * @return Container
     */
    public function getContainer(): Container
    {
        return $this->container;
    }


    public function getDelegate($className, $defaultValue = null)
    {
        return MiddlewareManager::getDelegate($className, $defaultValue);
    }

    public function hasDelegate($className)
    {
        return MiddlewareManager::hasDelegate($className);
    }
}