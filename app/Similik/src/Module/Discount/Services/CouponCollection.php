<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Services;


use GraphQL\Type\Definition\ResolveInfo;
use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Services\Di\Container;
use Similik\Services\Grid\CollectionBuilder;
use Similik\Services\Http\Request;

class CouponCollection extends CollectionBuilder
{
    /**@var Container $container*/
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;

        $this->init(_mysql()->getTable('coupon'));

        $this->defaultFilters();
    }

    protected function defaultFilters()
    {
        $this->addFilter('coupon', function($args) {
            $this->collection->andWhere('coupon.coupon', $args['operator'], $args['value']);
        });

        $this->addFilter('description', function($args) {
            $this->collection->andWhere('coupon.description', $args['operator'], $args['value']);
        });

        $this->addFilter('free_shipping', function($args) {
            $this->collection->andWhere('coupon.free_shipping', $args['operator'], $args['value']);
        });

        $this->addFilter('status', function($args) {
            $this->collection->andWhere('coupon.status', $args['operator'], (int)$args['value']);
        });

//        $this->addFilter('start_date', function($args) use ($isAdmin) {
//            $this->collection->andWhere('coupon.start_date', $args['operator'], (int)$args['value']);
//        });
//
//        $this->addFilter('end_date', function($args) use ($isAdmin) {
//            $this->collection->andWhere('coupon.end_date', $args['operator'], (int)$args['value']);
//        });
    }

    public function getData($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filter'] ?? [];
        foreach ($filters as $key => $arg)
            $this->applyFilter($key, $arg);

        return [
                'coupons' => $this->load(),
                'total' => $this->getTotal(),
                'currentFilter' => json_encode($filters, JSON_NUMERIC_CHECK)
            ];
    }

    public function getCollection()
    {
        return $this->collection;
    }

    public function getCouponIdArray($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filter'] ?? [];
        foreach ($filters as $key => $arg)
            $this->applyFilter($key, $arg);

        $collection = clone $this->collection;
        $ids = [];
        while ($row = $collection->addFieldToSelect("coupon.coupon_id")->fetch()) {
            $ids[] = $row['coupon_id'];
        }

        return $ids;
    }
}