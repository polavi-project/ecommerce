<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services\Di;


class Container extends \Pimple\Container
{
    /**
     * Register a service
     * @param $id
     * @param $value
     */
    public function set($id, $value)
    {
        parent::offsetSet($id, $value);
    }

    /**
     * Get a service, while app is loading modules, this method will return null
     * @param $id
     * @return mixed|null
     */
    public function get($id)
    {
        if ($this->offsetExists("moduleLoading")) {
            return null;
        }

        return parent::offsetGet($id);
    }

    /**
     * Get a service, while app is loading modules, this method will return null
     * @param $id
     * @return mixed|null
     */
    public function offsetGet($id)
    {
        if ($this->offsetExists("moduleLoading")) {
            return null;
        }

        return parent::offsetGet($id);
    }
}