<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

return [
    // Admin Panel
    [
        'method'   => 'GET',
        'path'     => '/shipping/locations',
        'middleware' => [
            \Similik\Module\ShippingLocation\Middleware\Location\Grid\DataMiddleware::class,
            \Similik\Module\ShippingLocation\Middleware\Location\Grid\GridMiddleware::class
        ],
        'is_admin' => true
    ],
    [
        'method'   => 'GET',
        'path'     => '/shipping/location/create',
        'middleware' => [
            \Similik\Module\ShippingLocation\Middleware\Location\Edit\FormMiddleware::class
        ],
        'is_admin' => true
    ],
    [
        'method'   => 'GET',
        'path'     => '/shipping/location/edit/{id:\d+}',
        'middleware' => [
            \Similik\Module\ShippingLocation\Middleware\Location\Edit\DataMiddleware::class,
            \Similik\Module\ShippingLocation\Middleware\Location\Edit\FormMiddleware::class
        ],
        'is_admin' => true
    ],
    [
        'method'   => 'POST',
        'path'     => '/shipping/location/save[/{id:\d+}]',
        'middleware' => [
            \Similik\Module\ShippingLocation\Middleware\Location\Save\ValidateMiddleware::class,
            \Similik\Module\ShippingLocation\Middleware\Location\Save\SaveMiddleware::class
        ],
        'is_admin' => true
    ]
];