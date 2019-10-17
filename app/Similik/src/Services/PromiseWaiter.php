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

    public function addPromise(Promise $promise)
    {
        if($this->isDone == true) {
            return $this;
        }
        $this->promises[] = $promise;

        return $this;
    }

    public function wait()
    {
        $promise = settle($this->promises);
        $promise->wait();
        $this->isDone = true;

        return $promise;
    }
}