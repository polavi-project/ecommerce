<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Services;


use GraphQL\Type\Definition\ResolveInfo;
use function Polavi\_mysql;
use Polavi\Services\Di\Container;
use Polavi\Services\Grid\CollectionBuilder;
use Polavi\Services\Http\Request;

class OrderCollection extends CollectionBuilder
{
    /**@var Container $container*/
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $collection = _mysql()->getTable('order');

        $this->init(
            $collection
        );

        $this->defaultFilters();
    }

    protected function defaultFilters()
    {
        $isAdmin = $this->container->get(Request::class)->isAdmin();

        $this->addFilter('id', function ($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            if ($args['operator'] == "BETWEEN") {
                $arr = explode("AND", $args['value']);
                $from = (int) trim($arr[0]);
                $to = isset($arr[1]) ? (int) trim($arr[1]) : null;
                $this->getCollection()->andWhere('order.order_id', '>=', $from);
                if ($to)
                    $this->getCollection()->andWhere('order.order_id', '<=', $to);
            } else {
                $this->getCollection()->andWhere('order.order_id', $args['operator'], $args['value']);
            }
        });

        $this->addFilter('order_number', function ($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            if ($args['operator'] == "BETWEEN") {
                $arr = explode("AND", $args['value']);
                $from = (int) trim($arr[0]);
                $to = isset($arr[1]) ? (int) trim($arr[1]) : null;
                $this->getCollection()->andWhere('order.order_number', '>=', $from);
                if ($to)
                    $this->getCollection()->andWhere('order.order_number', '<=', $to);
            } else {
                $this->getCollection()->andWhere('order.order_number', $args['operator'], $args['value']);
            }
        });

        $this->addFilter('grand_total', function ($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            if ($args['operator'] == "BETWEEN") {
                $arr = explode("AND", $args['value']);
                $from = (float) trim($arr[0]);
                $to = isset($arr[1]) ? (float) trim($arr[1]) : null;
                $this->getCollection()->andWhere('order.grand_total', '>=', $from);
                if ($to)
                    $this->getCollection()->andWhere('order.grand_total', '<=', $to);
            } else {
                $this->getCollection()->andWhere('order.grand_total', $args['operator'], $args['value']);
            }
        });

        $this->addFilter('payment_status', function ($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            $this->collection->andWhere('order.payment_status', $args['operator'], $args['value']);
        });

        $this->addFilter('shipment_status', function ($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            $this->collection->andWhere('order.shipment_status', $args['operator'], $args['value']);
        });

        $this->addFilter('created_at', function ($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            if ($args['operator'] == "BETWEEN") {
                $arr = explode("AND", $args['value']);
                $from = trim($arr[0]);
                $to = isset($arr[1]) ? trim($arr[1]) : null;
                $this->getCollection()->andWhere('order.created_at', '>=', $from);
                if ($to)
                    $this->getCollection()->andWhere('order.created_at', '<=', $to);
            } else {
                $this->getCollection()->andWhere('order.created_at', $args['operator'], $args['value']);
            }
        });

        $this->addFilter('page', function ($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setPage((int)$args['value']);
        });

        $this->addFilter('limit', function ($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setLimit((int)$args['value']);
        });

        $this->addFilter('sortBy', function ($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setSortBy($args['value']);
        });

        $this->addFilter('sortOrder', function ($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setSortOrder($args['value']);
        });
    }

    public function getData($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filter'] ?? [];
        foreach ($filters as $key => $arg)
            $this->applyFilter($key, $arg);

        return [
            'orders' => $this->load(),
            'total' => $this->getTotal(),
            'currentFilter' => json_encode($filters, JSON_NUMERIC_CHECK)
        ];
    }

    public function getCollection()
    {
        return $this->collection;
    }
}