<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);


namespace Polavi\Services\Event;


class EventDispatcher
{
    private $listeners = [];

    /**
     * @param $event
     * @param array $arguments
     */
    public function dispatch($event, array $arguments = [])
    {
        $listeners = $this->getListeners($event);

        // For filter variable
        if(!empty($listeners)) {
            foreach ($listeners as $listener) {
                $handler = $listener['handler'];
                $handler(...$arguments);
            }
        }
    }

    /**
     * @return array
     */
    public function getAllListeners()
    {
        return $this->listeners;
    }

    /**
     * @param string $event
     * @return array
     */
    public function getListeners(string $event)
    {
        $listeners = $this->listeners[$event] ?? [];

        return $this->sortListener($listeners);
    }

    /**
     * @param string $event
     * @param callable $handler
     * @param int $priority
     * @return $this
     */
    public function addListener(string $event, callable $handler, int $priority = 0)
    {
        $this->listeners[$event][] = ['handler'=>$handler, 'priority'=>$priority];

        return $this;
    }

    /**
     * @param array $listeners
     * @return array
     */
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
