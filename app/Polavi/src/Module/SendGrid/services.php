<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */


use function Polavi\get_config;

$container[\Polavi\Module\SendGrid\Services\SendGrid::class] = function() use ($container) {
    return new \Polavi\Module\SendGrid\Services\SendGrid(
        get_config('sendgrid_apiKey', null),
        get_config('sendgrid_sender_email', ''),
        get_config('sendgrid_sender_name', get_config('general_store_name', 'Online Store')),
        get_config('sendgrid_status', 1)
    );
};
