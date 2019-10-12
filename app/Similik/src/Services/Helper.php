<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services;

use Similik\Services\Db\Processor;
use Similik\Services\Db\Table;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;
use Similik\Services\Locale\Language;
use function Similik\the_container;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Component\HttpFoundation\Session\Session;

class Helper
{
    public static function getMysqlTable(string $name)
    {
        return new Table($name, the_container()->get(Processor::class));
    }
}