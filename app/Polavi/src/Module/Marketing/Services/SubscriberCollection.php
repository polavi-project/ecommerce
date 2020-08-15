<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Marketing\Services;


use GraphQL\Type\Definition\ResolveInfo;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;
use Polavi\Services\Grid\CollectionBuilder;
use Polavi\Services\Http\Request;

class SubscriberCollection extends CollectionBuilder
{
    /**@var Container $container*/
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $collection = _mysql()->getTable('newsletter_subscriber')
            ->addFieldToSelect("newsletter_subscriber.*")
            ->addFieldToSelect("customer.full_name")
            ->leftJoin("customer");

        dispatch_event("before_init_subscriber_collection", [$collection]);
        $this->init(
            $collection
        );

        $this->defaultFilters();
    }

    protected function defaultFilters()
    {
        $isAdmin = $this->container->get(Request::class)->isAdmin();
        $this->addFilter('id', function($args) {
            $this->collection->andWhere('newsletter_subscriber.customer_id', $args['operator'], $args['value']);
        });

        $this->addFilter('full_name', function($args) {
            $this->collection->andWhere('customer.full_name', $args['operator'], $args['value']);
        });

        $this->addFilter('email', function($args) {
            $this->collection->andWhere('newsletter_subscriber.email', $args['operator'], $args['value']);
        });

        $this->addFilter('status', function($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            $this->collection->andWhere('newsletter_subscriber.status', $args['operator'], (int)$args['value']);
        });

        $this->addFilter('page', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setPage((int)$args['value']);
        });

        $this->addFilter('limit', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setLimit((int)$args['value']);
        });

        $this->addFilter('sortBy', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setSortBy($args['value']);
        });

        $this->addFilter('sortOrder', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setSortOrder($args['value']);
        });
    }

    public function getData($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filters'] ?? [];
        foreach ($filters as $key => $arg)
            $this->applyFilter($arg["key"], $arg);

        return [
            'subscribers' => $this->load(),
            'total' => $this->getTotal(),
            'currentFilter' => json_encode($filters, JSON_NUMERIC_CHECK)
        ];
    }

    public function getCollection()
    {
        return $this->collection;
    }
}