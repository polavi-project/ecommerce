<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use Similik\Services\Di\Container;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

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
}