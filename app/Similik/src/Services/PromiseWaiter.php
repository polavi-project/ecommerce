<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services;


use GuzzleHttp\Promise\Promise;
use function GuzzleHttp\Promise\settle;

class PromiseWaiter
{
    /**@var Promise[] $promises*/
    protected $promises;

    protected $isDone = false;

    public function addPromise(string $key, Promise $promise)
    {
        if($this->isDone == true || isset($this->promises[$key])) {
            return $this;
        }

        $this->promises[$key] = $promise;

        return $this;
    }

    /**/
    /**
     * @param string $key
     * @return Promise|null
     */
    public function getPromise(string $key)
    {
        return isset($this->promises[$key]) ? $this->promises[$key] : null;
    }

    public function wait()
    {
        $promise = settle($this->promises);
        $promise->wait();
        $this->isDone = true;

        return $promise;
    }
}