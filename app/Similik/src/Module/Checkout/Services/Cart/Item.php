<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services\Cart;


use GuzzleHttp\Promise\FulfilledPromise;
use GuzzleHttp\Promise\Promise;
use GuzzleHttp\Promise\RejectedPromise;
use function Similik\dispatch_event;

class Item
{
    protected $fields  = [];

    protected $data = [];

    protected $resolvers = [];

    protected $isRunning = false;

    protected $error;

    protected $dataSource = [];

    /**@var Promise $setDataPromises*/
    protected $setDataPromises;

    public function __construct(array $fields, array $dataSource)
    {
        $this->fields = $fields;
        $this->dataSource = $dataSource;
    }

    public function setData($key, $value)
    {
        if($this->isRunning == true)
            return new RejectedPromise("Can not set value when resolves are running");

        if(isset($this->fields[$key]) and !empty($this->fields[$key]['dependencies'])) {
            $this->dataSource[$key] = $value;
            $promise = new \GuzzleHttp\Promise\Promise(function() use (&$promise, $key, $value) {
                if($this->getData($key) == $value) {
                    $promise->resolve($value);
                } else
                    $promise->reject("Can not change {$key} field to {$value}");
            });
            $this->setDataPromises = $promise;
            $this->onChange(null);

            return $promise;
        } else {
            if(isset($this->data[$key]) and $this->data[$key] === $value)
                return new FulfilledPromise($value);

            $resolver = \Closure::bind($this->resolvers[$key], $this);
            $_value = $resolver($this, array_merge($this->dataSource, [$key=> $value]));

            if($value != $_value) {
                return new RejectedPromise("Field resolver returns different value");
            } else {
                $this->data[$key] = $value;
                $this->dataSource[$key] = $value;
                $this->onChange($key);
                return new FulfilledPromise($value);
            }
        }
    }

    public function getData($key)
    {
        return $this->data[$key] ?? null;
    }

    public function toArray()
    {
        return $this->data;
    }

    protected function onChange($trigger)
    {
        if($this->isRunning == false) {
            $this->isRunning = true;
            //$this->error = null;
            foreach ($this->resolvers as $field=>$resolver) {
                if($field != $trigger) {
                    $this->data[$field] = $resolver($this, $this->dataSource);
                }
            }
            $this->isRunning = false;
            if($this->setDataPromises)
                $this->setDataPromises->wait();
            dispatch_event('cart_item_updated', [$this, $trigger]);
        }
    }

    /**
     * @param array $resolvers
     * @return Item
     */
    public function setResolvers(array $resolvers): Item
    {
        if(!$this->resolvers)
            $this->resolvers = $resolvers;
        return $this;
    }

    /**
     * @return array
     */
    public function getResolvers(): array
    {
        return $this->resolvers;
    }

    /**
     * @param mixed $error
     * @return Item
     */
    public function setError($error)
    {
        $this->error = $error;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }
}