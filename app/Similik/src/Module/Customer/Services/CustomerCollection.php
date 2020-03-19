<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Services;


use GraphQL\Type\Definition\ResolveInfo;
use function Similik\_mysql;
use function Similik\dispatch_event;
use function Similik\get_default_language_Id;
use Similik\Services\Di\Container;
use Similik\Services\Grid\CollectionBuilder;
use Similik\Services\Http\Request;

class CustomerCollection extends CollectionBuilder
{
    /**@var Container $container*/
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $collection = _mysql()->getTable('customer');

        dispatch_event("before_init_customer_collection", [$collection]);
        $this->init(
            $collection
        );

        $this->defaultFilters();
    }

    protected function defaultFilters()
    {
        $isAdmin = $this->container->get(Request::class)->isAdmin();
        $this->addFilter('id', function($args) {
            $this->collection->andWhere('customer.customer_id', $args['operator'], $args['value']);
        });

        $this->addFilter('name', function($args) {
            $this->collection->andWhere('customer.full_name', $args['operator'], $args['value']);
        });

        $this->addFilter('email', function($args) {
            $this->collection->andWhere('customer.email', $args['operator'], $args['value']);
        });

        $this->addFilter('group', function($args) {
            $this->collection->andWhere('customer.group_id', $args['operator'], $args['value']);
        });

        $this->addFilter('status', function($args) use ($isAdmin) {
            if($isAdmin == false)
                return;
            $this->collection->andWhere('customer.status', $args['operator'], (int)$args['value']);
        });
    }

    public function getData($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filter'] ?? [];
        foreach ($filters as $key => $arg)
            $this->applyFilter($key, $arg);

        return [
            'customers' => $this->load(),
            'total' => $this->getTotal(),
            'currentFilter' => json_encode($filters, JSON_NUMERIC_CHECK)
        ];
    }

    public function getCollection()
    {
        return $this->collection;
    }
}