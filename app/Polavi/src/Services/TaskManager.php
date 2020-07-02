<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services;


trait TaskManager
{
    protected $tasks;

    protected $isRunning;

    public function addTask(callable $task, int $sortOrder)
    {
        $this->tasks[] = [
            'callback' => $task,
            'sort_order' => $sortOrder
        ];

        return $this;
    }

    public function execute()
    {

    }

    public function removeTask()
    {

    }
}
