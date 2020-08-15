<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services\Grid;


use Polavi\Services\Db\Table;

class CollectionBuilder
{
    protected $filters = [];

    protected $sortBy;

    protected $sortOrder;

    protected $page;

    protected $limit;

    /**@var Table $collection*/
    protected $collection;

    /**
     * This collection builder requires a Table to be initialized.
     * @param Table $table
     * @return $this
     */
    public function init(Table $table)
    {
        $this->collection = $table;

        return $this;
    }

    /**
     * @return array
     */
    public function load()
    {
        $setting = [
            'page'=> $this->page ?? 1,
            'limit'=> $this->limit ?? 20,
            'sort_by'=> $this->sortBy,
            'sort_order'=> $this->sortOrder
        ];

        return $this->collection->fetchAssoc($setting);
    }

    /**
     * @return array
     */
    public function getFilter(): array
    {
        return $this->filters;
    }

    /**
     * @param string $key
     * @param callable $callBack
     * @return self
     */
    public function addFilter(string $key, callable $callBack): self
    {
        if (isset($this->filters[$key])) {
            return $this;
        }

        $this->filters[$key] = $callBack;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getSortBy()
    {
        return $this->sortBy;
    }

    /**
     * @param mixed $sortBy
     */
    public function setSortBy($sortBy): void
    {
        $this->sortBy = $sortBy;
    }

    /**
     * @return mixed
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * @param mixed $page
     */
    public function setPage($page): void
    {
        $this->page = $page;
    }

    /**
     * @return mixed
     */
    public function getLimit()
    {
        return $this->limit;
    }

    /**
     * @param mixed $limit
     */
    public function setLimit($limit): void
    {
        $this->limit = $limit;
    }

    /**
     * @return mixed
     */
    public function getSortOrder()
    {
        return $this->sortOrder;
    }

    /**
     * @param mixed $sortOrder
     */
    public function setSortOrder($sortOrder): void
    {
        $this->sortOrder = $sortOrder;
    }

    /**
     * Loop through the filter callbacks and execute one by one
     * @param $id
     * @param array $args
     */
    protected function applyFilter($id, $args = [])
    {
        if (isset($this->filters[$id])) {
            $this->filters[$id]($args);
        }
    }

    /**
     * Get total number of record, for pagination purpose.
     * @return int
     */
    protected function getTotal()
    {
        $collection = clone $this->collection;
        $row = $collection->setFieldToSelect("COUNT(*)", "total")->fetchOneAssoc();

        return $row["total"] ?? 0;
    }
}