<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Similik\Services\Di\Container $container */


use function Similik\get_config;

$container[\Similik\Module\SendGrid\Services\SendGrid::class] = function() use ($container) {
    return new \Similik\Module\SendGrid\Services\SendGrid(
        get_config('sendgrid_apiKey', null),
        get_config('sendgrid_sender_email', ''),
        get_config('sendgrid_sender_name', get_config('general_store_name', 'Online Store')),
        get_config('sendgrid_status', 1)
    );
};
