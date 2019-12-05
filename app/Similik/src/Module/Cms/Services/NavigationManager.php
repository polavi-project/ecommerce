<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Services;


class NavigationManager
{
    protected $items = [];

    public function addItem(
        string $id,
        string $title,
        string $url = null,
        string $icon = null,
        string $parentId = null,
        int $sortOrder = 1
    )
    {
        $this->items[$id] = [
            "id" => $id,
            "sort_order" => $sortOrder,
            "url" => $url,
            "title" => $title,
            "icon" => $icon,
            "parent_id" => $parentId
        ];

        return $this;
    }

    public function removeItem(string $id)
    {
        unset($this->items[$id]);

        return $this;
    }

    public function getItems()
    {
        return $this->items;
    }
}