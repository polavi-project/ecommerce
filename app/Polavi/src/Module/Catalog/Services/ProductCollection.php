<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services;


use GraphQL\Type\Definition\ResolveInfo;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use function Polavi\get_config;
use Polavi\Services\Di\Container;
use Polavi\Services\Grid\CollectionBuilder;
use Polavi\Services\Http\Request;

class ProductCollection extends CollectionBuilder
{
    /**@var Container $container*/
    protected $container;

    public function __construct(Container $container)
    {
        $this->container = $container;

        $collection = _mysql()->getTable('product')
            ->addFieldToSelect("product.*")
            ->addFieldToSelect("product_description.*")
            ->leftJoin('product_description');

        // Display out of stock or not
        if (!$container->get(Request::class)->isAdmin()) {
            $setting = get_config('catalog_out_of_stock_display', 0);
            if ($setting == 0) {
                $collection->where('product.manage_stock', '=', 0, "(")->orWhere('product.qty', '>', 0, '(')->andWhere('product.stock_availability', '=', 1, null, '))');
            }
        }
        if (!$container->get(Request::class)->isAdmin()) {
            $customerGroupId = $container->get(Request::class)->getCustomer()->isLoggedIn() ? $container->get(Request::class)->getCustomer()->getData('group_id') ?? 1 : 999;
            $collection
                ->addFieldToSelect("LEAST(product.`price`, IF(ppone.`tier_price` IS NULL, 1000000000, ppone.`tier_price`) , IF(pptwo.`tier_price` IS NULL, 1000000000, pptwo.`tier_price`))", "sale_price")
                ->leftJoin('product_price', 'ppone', [
                [
                    'column'      => "ppone.qty",
                    'operator'    => "=",
                    'value'       => 1,
                    'ao'          => 'and',
                    'start_group' => null,
                    'end_group'   => null
                ],
                [
                    'column'      => "ppone.tier_price",
                    'operator'    => "<=",
                    'value'       => "product.price",
                    'isValueAColumn' => true,
                    'ao'          => 'and',
                    'start_group' => null,
                    'end_group'   => null
                ],
                [
                    'column'      => "ppone.customer_group_id",
                    'operator'    => "=",
                    'value'       => $customerGroupId,
                    'ao'          => 'and',
                    'start_group' => null,
                    'end_group'   => null
                ],
                [
                    'column'      => "ppone.active_from",
                    'operator'    => "IS",
                    'value'       => null,
                    'ao'          => 'and',
                    'start_group' => '((',
                    'end_group'   => null
                ],
                [
                    'column'      => "ppone.active_from",
                    'operator'    => "<=",
                    'value'       => date("Y-m-d H:i:s"),
                    'ao'          => 'or',
                    'start_group' => null,
                    'end_group'   => ')'
                ],
                [
                    'column'      => "ppone.active_to",
                    'operator'    => "IS",
                    'value'       => null,
                    'ao'          => 'and',
                    'start_group' => '(',
                    'end_group'   => null
                ],
                [
                    'column'      => "ppone.active_to",
                    'operator'    => ">=",
                    'value'       => date("Y-m-d H:i:s"),
                    'ao'          => 'or',
                    'start_group' => null,
                    'end_group'   => '))'
                ]
            ])->leftJoin('product_price', 'pptwo', [
                    [
                        'column'      => "pptwo.qty",
                        'operator'    => "=",
                        'value'       => 1,
                        'ao'          => 'and',
                        'start_group' => null,
                        'end_group'   => null
                    ],
                    [
                        'column'      => "pptwo.tier_price",
                        'operator'    => "<=",
                        'value'       => "product.price",
                        'isValueAColumn' => true,
                        'ao'          => 'and',
                        'start_group' => null,
                        'end_group'   => null
                    ],
                    [
                        'column'      => "pptwo.customer_group_id",
                        'operator'    => "=",
                        'value'       => 1000,
                        'ao'          => 'and',
                        'start_group' => null,
                        'end_group'   => null
                    ],
                    [
                        'column'      => "pptwo.active_from",
                        'operator'    => "IS",
                        'value'       => null,
                        'ao'          => 'and',
                        'start_group' => '((',
                        'end_group'   => null
                    ],
                    [
                        'column'      => "pptwo.active_from",
                        'operator'    => "<=",
                        'value'       => date("Y-m-d H:i:s"),
                        'ao'          => 'or',
                        'start_group' => null,
                        'end_group'   => ')'
                    ],
                    [
                        'column'      => "pptwo.active_to",
                        'operator'    => "IS",
                        'value'       => null,
                        'ao'          => 'and',
                        'start_group' => '(',
                        'end_group'   => null
                    ],
                    [
                        'column'      => "pptwo.active_to",
                        'operator'    => ">=",
                        'value'       => date("Y-m-d H:i:s"),
                        'ao'          => 'or',
                        'start_group' => null,
                        'end_group'   => '))'
                    ]
                ]);
        }

        if ($this->container->get(Request::class)->isAdmin() == false) {
            $collection->andWhere('product.status', '=', 1);
        }

        $this->init($collection);

        $this->defaultFilters();
        dispatch_event('after_init_product_collection', [$collection]);
    }

    protected function defaultFilters()
    {
        $isAdmin = $this->container->get(Request::class)->isAdmin();

        $this->addFilter('id', function($args) use($isAdmin) {
            if ($isAdmin == true) {
                if ($args['operator'] == "BETWEEN") {
                    $arr = explode("-", $args['value']);
                    $from = (float) trim($arr[0]);
                    $to = isset($arr[1]) ? (float) trim($arr[1]) : null;
                    $this->getCollection()->andWhere('product.product_id', '>=', $from);
                    if ($to)
                        $this->getCollection()->andWhere('product.product_id', '<=', $to);
                } else {
                    $this->getCollection()->andWhere('product.product_id', $args['operator'], $args['value']);
                }
            }
        });

        $this->addFilter('price', function($args) use($isAdmin) {
            if ($isAdmin == true) {
                if ($args['operator'] == "BETWEEN") {
                    $arr = explode("-", $args['value']);
                    $from = (float) trim($arr[0]);
                    $to = isset($arr[1]) ? (float) trim($arr[1]) : null;
                    $this->getCollection()->andWhere('product.price', '>=', $from);
                    if ($to)
                        $this->getCollection()->andWhere('product.price', '<=', $to);
                } else {
                    $this->getCollection()->andWhere('product.price', $args['operator'], $args['value']);
                }
            } else {
                if ($args['operator'] == "BETWEEN") {
                    $arr = explode("-", $args['value']);
                    $from = (float) trim($arr[0]);
                    $to = isset($arr[1]) ? (float) trim($arr[1]) : null;
                    $this->getCollection()->andHaving('sale_price', '>=', $from);
                    if ($to)
                        $this->getCollection()->andHaving('sale_price', '<=', $to);
                } else {
                    $this->getCollection()->andHaving('sale_price', $args['operator'], $args['value']);
                }
            }
        });

        $this->addFilter('qty', function($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            if ($args['operator'] == "BETWEEN") {
                $arr = explode("-", $args['value']);
                $from = (int) trim($arr[0]);
                $to = isset($arr[1]) ? (int) trim($arr[1]) : null;
                $this->getCollection()->andWhere('product.qty', '>=', $from);
                if ($to)
                    $this->getCollection()->andWhere('product.qty', '<=', $to);
            } else {
                $this->getCollection()->andWhere('product.qty', $args['operator'], $args['value']);
            }
        });

        $this->addFilter('name', function($args) {
            $this->getCollection()->andWhere('product_description.name', $args['operator'], $args['value']);
        });

        $this->addFilter('status', function($args) use ($isAdmin) {
            if ($isAdmin == false)
                return;
            $this->getCollection()->andWhere('product.status', $args['operator'], (int)$args['value']);
        });

        $this->addFilter('category', function($args) use ($isAdmin) {
            if ($args['operator'] == "IN") {
                $ids = array_map('intval', explode(',', $args['value']));
                $stm = _mysql()
                    ->getTable('product_category')
                    ->where('category_id', 'IN', $ids);
                $productIds = [];
                while ($row = $stm->fetch()) {
                    $productIds[] = $row['product_id'];
                }

                if (!$productIds)
                    $productIds = [-1];

                $this->getCollection()->where('product.product_id', 'IN', $productIds);
            } else if ($args['operator'] == "=") {
                $stm = _mysql()
                    ->getTable('product_category')
                    ->where('category_id', '=', $args['value']);
                $productIds = [];
                while ($row = $stm->fetch()) {
                    $productIds[] = $row['product_id'];
                }

                if (!$productIds)
                    $productIds = [-1];

                $this->getCollection()->where('product.product_id', 'IN', $productIds);
            }
        });

        $this->addFilter('sku', function($args) use ($isAdmin) {
            if ($args['operator'] == "IN") {
                $skus = explode(',', $args['value']);
                $this->getCollection()->andWhere('product.sku', 'IN', $skus);
            } else {
                $this->getCollection()->andWhere('product.sku', $args['operator'], $args['value']);
            }
        });

        $conn = _mysql();
        $tmp = $conn->getTable('attribute')
            ->addFieldToSelect('attribute_code')
            ->where('type', 'IN', ['select', 'multiselect'])
            ->andWhere('is_filterable', '=', 1);
        while($row = $tmp->fetch()) {
            $this->addFilter($row['attribute_code'], function($args) use ($isAdmin, $conn) {
                if ($args['operator'] == "IN") {
                    $ids = array_map('intval', explode(',', $args['value']));
                    $stm = $conn->getTable('product_attribute_value_index')
                        ->addFieldToSelect('product_id')
                        ->where('option_id', 'IN', $ids);
                    $productIds = [];
                    while ($row = $stm->fetch()) {
                        $productIds[] = $row['product_id'];
                    }
                    $this->getCollection()->andWhere('product.product_id', 'IN', $productIds);
                } else {
                    $stm = $conn->getTable('product_attribute_value_index')
                        ->addFieldToSelect('product_id')
                        ->where('option_id', '=', $args['value']);
                    $productIds = [];
                    while ($row = $stm->fetch()) {
                        $productIds[] = $row['product_id'];
                    }
                    $this->getCollection()->andWhere('product.product_id', 'IN', $productIds);
                }
            });
        }

        $this->addFilter('page', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setPage((int)$args['value']);
        });

        $this->addFilter('limit', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setLimit((int)$args['value']);
        });

        $this->addFilter('sort-by', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setSortBy($args['value']);
        });

        $this->addFilter('sort-order', function($args) use ($isAdmin) {
            if ($args['operator'] !== "=")
                return;
            $this->setSortOrder($args['value']);
        });
    }

    public function getData($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filters'] ?? [];

        foreach ($filters as $key => $arg)
            $this->applyFilter($arg["key"], $arg);

        return [
                'products' => $this->load(),
                'total' => $this->getTotal(),
                'currentFilter' => json_encode($filters, JSON_NUMERIC_CHECK)
            ];
    }

    public function load()
    {
        $setting = [
            'page'=> $this->page ?? 1,
            'limit'=> $this->limit ?? get_config('catalog_product_list_limit', 20),
            'sort_by'=> $this->sortBy ?? get_config('catalog_product_list_sort_by', 'product.created_at'),
            'sort_order'=> $this->sortOrder ?? get_config('catalog_product_list_sort_order', 'DESC')
        ];

        // Visibility (For variant purpose)
        if (!$this->container->get(Request::class)->isAdmin()) {
            $visibleGroups = _mysql()->getTable("variant_group")->addFieldToSelect("variant_group_id")->where("visibility", "=", 1)->fetchAllAssoc();
            $groups = [];
            foreach ($visibleGroups as $group) {
                $groups[] = $group['variant_group_id'];
            }
            $copyCollection = clone $this->getCollection();
            if ($groups) {
                $unvisibleIds = $copyCollection
                    ->addFieldToSelect("SUM(product.visibility)", "sumv")
                    ->andWhere("product.variant_group_id", "IN", $groups)
                    ->groupBy("product.variant_group_id")
                    ->having("sumv", "=", 0)
                    ->fetchAssoc($setting);
                $ids = [];
                foreach ($unvisibleIds as $id) {
                    $ids[] = $id['product_id'];
                }
                if ($ids)
                    $this->getCollection()
                        ->andWhere("product.visibility", "<>", 0, "((", null)
                        ->orWhere("product.visibility", "IS", null, null, ")")
                        ->orWhere("product.product_id", "IN", $ids, null, ")");
                else
                    $this->getCollection()
                        ->andWhere("product.visibility", "<>", 0, "(")
                        ->orWhere("product.visibility", "IS", null, null, ")");
            } else {
                $this->getCollection()
                    ->andWhere("product.visibility", "<>", 0, "(")
                    ->orWhere("product.visibility", "IS", null, null, ")");
            }
        }
        return $this->getCollection()->fetchAssoc($setting);
    }

    public function getCollection()
    {
        return $this->collection;
    }

    public function getProductIdArray($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $filters = $args['filters'] ?? [];
        foreach ($filters as $key => $arg)
            $this->applyFilter($key, $arg);

        $setting = [
            'page'=> $this->page ?? 1,
            'limit'=> $this->limit ?? get_config('catalog_product_list_limit', 20),
            'sort_by'=> $this->sortBy ?? get_config('catalog_product_list_sort_by', 'product.created_at'),
            'sort_order'=> $this->sortOrder ?? get_config('catalog_product_list_sort_order', 'DESC')
        ];

        // Visibility (For variant purpose)
        if (!$this->container->get(Request::class)->isAdmin()) {
            $visibleGroups = _mysql()->getTable("variant_group")->addFieldToSelect("variant_group_id")->where("visibility", "=", 1)->fetchAllAssoc();
            $groups = [];
            foreach ($visibleGroups as $group) {
                $groups[] = $group['variant_group_id'];
            }
            if ($groups) {
                $c = clone $this->collection;
                $unvisibleIds = $c
                    ->addFieldToSelect("SUM(product.visibility)", "sumv")
                    ->andWhere("product.variant_group_id", "IN", $groups)
                    ->groupBy("product.variant_group_id")
                    ->having("sumv", "=", 0)
                    ->fetchAssoc($setting);
                $ids = [];
                foreach ($unvisibleIds as $id) {
                    $ids[] = $id['product_id'];
                }
                if ($ids)
                    $this->getCollection()
                        ->andWhere("product.visibility", "<>", 0, "((", null)
                        ->orWhere("product.visibility", "IS", null, null, ")")
                        ->orWhere("product.product_id", "IN", $ids, null, ")");
                else
                    $this->getCollection()
                        ->andWhere("product.visibility", "<>", 0, "(")
                        ->orWhere("product.visibility", "IS", null, null, ")");
            } else {
                $this->getCollection()
                    ->andWhere("product.visibility", "<>", 0, "(")
                    ->orWhere("product.visibility", "IS", null, null, ")");
            }
        }
        $ids = [];
        while ($row = $this->getCollection()->setFieldToSelect("product.product_id")->fetch()) {
            $ids[] = $row['product_id'];
        }

        return $ids;
    }

    protected function getTotal()
    {
        $collection = clone $this->collection;
        $setting = [
            'page'=> $this->page ?? 1,
            'limit'=> $this->limit ?? get_config('catalog_product_list_limit', 20),
            'sort_by'=> $this->sortBy ?? get_config('catalog_product_list_sort_by', 'product.created_at'),
            'sort_order'=> $this->sortOrder ?? get_config('catalog_product_list_sort_order', 'DESC')
        ];

        // Visibility (For variant purpose)
        if (!$this->container->get(Request::class)->isAdmin()) {
            $visibleGroups = _mysql()->getTable("variant_group")->addFieldToSelect("variant_group_id")->where("visibility", "=", 1)->fetchAllAssoc();
            $groups = [];
            foreach ($visibleGroups as $group) {
                $groups[] = $group['variant_group_id'];
            }
            if ($groups) {
                $c = clone $this->collection;
                $unvisibleIds = $c
                    ->addFieldToSelect("SUM(product.visibility)", "sumv")
                    ->andWhere("product.variant_group_id", "IN", $groups)
                    ->groupBy("product.variant_group_id")
                    ->having("sumv", "=", 0)
                    ->fetchAssoc($setting);
                $ids = [];
                foreach ($unvisibleIds as $id) {
                    $ids[] = $id['product_id'];
                }
                if ($ids)
                    $collection
                        ->andWhere("product.visibility", "<>", 0, "((", null)
                        ->orWhere("product.visibility", "IS", null, null, ")")
                        ->orWhere("product.product_id", "IN", $ids, null, ")");
                else
                    $collection
                        ->andWhere("product.visibility", "<>", 0, "(")
                        ->orWhere("product.visibility", "IS", null, null, ")");
            } else {
                $collection
                    ->andWhere("product.visibility", "<>", 0, "(")
                    ->orWhere("product.visibility", "IS", null, null, ")");
            }
        }
        $row = $collection->addFieldToSelect("COUNT(*)", "total")->fetchOneAssoc();
        return $row["total"] ?? 0;
    }
}