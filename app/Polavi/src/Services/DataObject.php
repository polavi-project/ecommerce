<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services;

class DataObject implements \ArrayAccess
{
    private $data = [];

    private $isChanged = false;

    public function __construct(array $data = [])
    {
        $this->data = $data;
    }

    public function offsetSet($key, $value)
    {
        if (isset($this->data[$key]) and $this->data[$key] === $value) {
            return $this;
        }
        $this->data[$key] = $value;
        $this->isChanged = true;

        return $this;
    }

    public function offsetUnset($key)
    {
        if (!isset($this->data[$key])) {
            return $this;
        }
        unset($this->data[$key]);
        $this->isChanged = true;

        return $this;
    }

    public function offsetGet($key, $default = null)
    {
        if (isset($this->data[$key])) {
            return $this->data[$key];
        }

        return $default;
    }

    public function offsetExists($key)
    {
        return isset($this->data[$key]) ? true : false;
    }

    public function get($key, $default = null)
    {
        return $this->offsetGet($key, $default);
    }

    public function set($key, $value)
    {
        return $this->offsetSet($key, $value);
    }

    public function has($key)
    {
        return $this->offsetExists($key);
    }

    public function toArray()
    {
        return $this->data;
    }
}