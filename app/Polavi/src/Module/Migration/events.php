<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Polavi\Services\Event\EventDispatcher $eventDispatcher */

$eventDispatcher->addListener(
        "admin_menu",
        function (array $items) {
            return array_merge($items, [
                [
                    "id" => "extension",
                    "sort_order" => 55,
                    "url" => null,
                    "title" => "Extension",
                    "parent_id" => null
                ],
                [
                    "id" => "extension_grid",
                    "sort_order" => 10,
                    "url" => \Polavi\generate_url("extensions.grid"),
                    "title" => "Extension manager",
                    "icon" => "puzzle-piece",
                    "parent_id" => "extension"
                ]
            ]);
        },
        0
);