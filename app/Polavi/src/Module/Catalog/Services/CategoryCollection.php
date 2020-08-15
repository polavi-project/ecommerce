<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services;


use GraphQL\Type\Definition\ResolveInfo;
use function Polavi\_mysql;
use Polavi\Services\Di\Container;
use Polavi\Services\Grid\CollectionBuilder;
use Polavi\Services\Http\Request;

class CategoryCollection extends CollectionBuilder
{
    /**@var Container $container*/
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $collection = _mysql()->getTable('category')
            ->leftJoin('category_description');

        if ($this->container->get(Request::class)->isAdmin() == false) {
            $collection->where('category.status', '=', 1);
        }

        $this->init(
            $collection
        );

        $this->defaultFilters();
    }

    protected function defaultFilters()
    {
        $isAdmin = $this->container->get(Request::class)->isAdmin();

        $this->addFilter('name', function($args) {
            $this->collection->andWhere('category_description.name', $args['operator'], $args['value']);
        });

        $this->addFilter('status', function($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            $this->collection->andWhere('category.status', $args['operator'], (int)$args['value']);
        });

        $this->addFilter('include_in_nav', function($args) use ($isAdmin) {
            $this->collection->andWhere('category.include_in_nav', $args['operator'], (int)$args['value']);
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
            'categories' => $this->load(),
            'total' => $this->getTotal(),
            'currentFilter' => json_encode($filters, JSON_NUMERIC_CHECK)
        ];
    }

    public function getCollection()
    {
        return $this->collection;
    }

    public function getProductIdArray($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filter'] ?? [];
        foreach ($filters as $key => $arg)
            $this->applyFilter($key, $arg);

        $collection = clone $this->collection;
        $ids = [];
        while ($row = $collection->addFieldToSelect("category.category_id")->fetch()) {
            $ids[] = $row['category_id'];
        }

        return $ids;
    }
}