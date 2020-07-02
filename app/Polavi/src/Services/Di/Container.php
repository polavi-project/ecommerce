<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services\Di;


class Container extends \Pimple\Container
{
    public function set($id, $value)
    {
        parent::offsetSet($id, $value);
    }

    public function get($id)
    {
        return parent::offsetGet($id);
    }
}