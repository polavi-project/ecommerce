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

class AttributeCollection extends CollectionBuilder
{
    /**@var Container $container*/
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $collection = _mysql()->getTable('attribute');

        $this->init(
            $collection
        );

        $this->defaultFilters();
    }

    protected function defaultFilters()
    {
        $this->addFilter('attribute_name', function($args) {
            $this->getCollection()->andWhere('attribute.attribute_name', $args['operator'], $args['value']);
        });

        $this->addFilter('attribute_code', function($args) {
            $this->getCollection()->andWhere('attribute.attribute_code', $args['operator'], $args['value']);
        });

        $this->addFilter('is_required', function($args) {
            $this->getCollection()->andWhere('attribute.is_required', $args['operator'], $args['value']);
        });

        $this->addFilter('is_filterable', function($args) {
            $this->getCollection()->andWhere('attribute.is_filterable', $args['operator'], $args['value']);
        });

        $this->addFilter('display_on_frontend', function($args) {
            $this->getCollection()->andWhere('attribute.display_on_frontend', $args['operator'], $args['value']);
        });

        $this->addFilter('type', function($args) {
            $this->getCollection()->andWhere('attribute.type', $args['operator'], $args['value']);
        });

        $this->addFilter('page', function($args) {
            if($args['operator'] !== "=")
                return;
            $this->setPage((int)$args['value']);
        });

        $this->addFilter('limit', function($args) {
            if($args['operator'] !== "=")
                return;
            $this->setLimit((int)$args['value']);
        });

        $this->addFilter('sort-by', function($args) {
            if($args['operator'] !== "=")
                return;
            $this->setSortBy($args['value']);
        });

        $this->addFilter('sort-order', function($args) {
            if($args['operator'] !== "=")
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
            'attributes' => $this->load(),
            'total' => $this->getTotal(),
            'currentFilter' => json_encode($filters, JSON_NUMERIC_CHECK)
        ];
    }

    public function getCollection()
    {
        return $this->collection;
    }
}