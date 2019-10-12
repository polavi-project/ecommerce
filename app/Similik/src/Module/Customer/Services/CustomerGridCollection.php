<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Services;


use GraphQL\Type\Definition\ResolveInfo;
use function Similik\_mysql;
use Similik\Services\Di\Container;
use Similik\Services\Grid\CollectionBuilder;

class CustomerGridCollection extends CollectionBuilder
{
    public function __construct()
    {
        $conn = _mysql();
        $this->init(
            $conn->getTable('customer')
        );
    }

    public function getData($rootValue, $args, Container $container, ResolveInfo $info)
    {
        parse_str($args['filter'], $filter);
        $this->setFilter($filter);
        return [
                'customers'=> $this->load(),
                'total'=> $this->getTotal()
            ];
    }

    public function getCollection()
    {
        return $this->collection;
    }
}