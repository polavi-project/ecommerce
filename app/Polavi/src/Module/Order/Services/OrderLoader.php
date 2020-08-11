<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Services;


use function Polavi\dispatch_event;
use Polavi\Services\Db\Processor;
use Polavi\Services\Db\Table;
use function Polavi\the_container;

class OrderLoader extends Table
{
    protected $loadedOrders = [];

    public function __construct()
    {
        parent::__construct("order", the_container()->get(Processor::class));
        parent::addFieldToSelect("order.*");

        dispatch_event("order_loader_init", [$this]);
    }

    public function load($id)
    {
        if(isset($this->loadedOrders[$id]))
            return $this->loadedOrders[$id];

        $order = parent::load($id);
        if($order)
            $this->loadedOrders[$id] = $order;

        return $order;
    }
}