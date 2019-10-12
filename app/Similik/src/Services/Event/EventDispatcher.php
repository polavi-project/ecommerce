<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);


namespace Similik\Services\Event;


class EventDispatcher
{
    private $listeners = [];

    public function dispatch($event, array $arguments = [])
    {
        //echo $event;
        $listeners = $this->getListeners($event);

        // For filter variable
        if(empty($listeners))
            return null;

        $value = null;
        foreach ($listeners as $listener) {
            $handler = $listener['handler'];
            $temp = $handler(...$arguments);
            if($temp !== null)
                $value = $temp;
        }

        return $value;
    }

    public function getAllListeners()
    {
        return $this->listeners;
    }

    protected function getListeners(string $event)
    {
        $listeners = $this->listeners[$event] ?? [];

        return $this->sortListener($listeners);
    }

    public function addListener(string $event, callable $handler, int $priority = 0)
    {
        $this->listeners[$event][] = ['handler'=>$handler, 'priority'=>$priority];

        return $this;
    }

    protected function sortListener($listeners = [])
    {
        usort($listeners, function ($a, $b) {
            if($a['priority'] == $b['priority'])
                return 0;
            return ($a['priority'] <= $b['priority']) ? -1 : 1;
        });

        return $listeners;
    }

}
