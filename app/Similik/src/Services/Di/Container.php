<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services\Di;


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