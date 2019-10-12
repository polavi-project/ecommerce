<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services\Grid;


use function Similik\get_default_language_Id;
use Similik\Services\Db\Table;

class CollectionBuilder
{
    protected $filters = [];

    protected $sortBy;

    protected $offset;

    protected $page;

    protected $limit;

    /**@var Table $collection*/
    protected $collection;

    public function init(Table $table)
    {
        $this->collection = $table;

        return $this;
    }

    public function load()
    {
        return $this->collection->fetchAssoc();
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
        if(isset($this->filters[$key]))
            return $this;

        $this->filters[$key] = $callBack;
        return $this;
    }

    protected function applyFilter($id, $args = [])
    {
        if(isset($this->filters[$id]))
            $this->filters[$id]($args);
    }

    protected function getTotal()
    {
        $collection = clone $this->collection;
        $row = $collection->addFieldToSelect("COUNT(*)", "total")->fetch();

        return $row['total'];
    }
}