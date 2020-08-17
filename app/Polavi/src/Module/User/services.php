<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/**@var \Polavi\Services\Di\Container $container */

$container[\Polavi\Module\User\Services\Authenticator::class] = function () use ($container) {
    return new \Polavi\Module\User\Services\Authenticator($container[\Polavi\Services\Http\Request::class]);
};