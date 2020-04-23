<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services;


// TODO: To use Dataloader
use GraphQL\Type\Definition\ResolveInfo;
use function Similik\get_default_language_Id;
use Similik\Services\Db\Processor;
use Similik\Services\Db\Table;
use Similik\Services\Di\Container;

class DataLoader
{
    public function getCategories ($rootValue, $args, Container $container, ResolveInfo $info) {
        $categoryTable = new Table('category', $container->get(Processor::class));
        $categoryTable->leftJoin('category_description', null, [
            [
                'column'      => "category_description.language_id",
                'operator'    => "=",
                'value'       => $args['language'] ?? get_default_language_Id(),
                'ao'          => 'and',
                'start_group' => null,
                'end_group'   => null
            ]
        ]);

        return $categoryTable->fetchAllAssoc();
    }

    public function getProductAdvancedPrice($product, $args, Container $container, ResolveInfo $info)
    {
        $priceTable = new Table('product_price', $container->get(Processor::class));
        $priceTable->where('product_price_product_id', '=', $product['product_id']);

        return $priceTable->fetchAllAssoc();
    }

    public function getProductAttributeGroup($product, $args, Container $container, ResolveInfo $info)
    {
        $attributeGroupTable = new Table('attribute_group', $container->get(Processor::class));
        $attributeGroupTable->where('attribute_group_id', '=', $product['group_id']);

        return $attributeGroupTable->fetchOneAssoc();
    }

    public function getAttributeByGroup($group, $args, Container $container, ResolveInfo $info)
    {
        $attributeIds = [];
        $table = $container->get(Processor::class)->getTable('attribute_group_link');
        while ($row = $table
            ->where('group_id', '=', $group['attribute_group_id'])
            ->fetch()) {
            $attributeIds[] = $row['attribute_id'];
        }
        return $container->get(Processor::class)
            ->getTable('attribute')
            ->where('attribute_id', 'IN', $attributeIds)
            ->fetchAllAssoc();
    }

    public function getAllAttributeGroup($rootValue, $args, Container $container, ResolveInfo $info)
    {
        return $container->get(Processor::class)
            ->getTable('attribute_group')
            ->fetchAllAssoc();
    }

    public function getProductAttributeIndex($rootValue, $args, Container $container, ResolveInfo $info)
    {
        return $container->get(Processor::class)->getTable('product_attribute_value_index')
            ->leftJoin('attribute')
            ->where('product_id', '=', $args['product_id'])
            ->andWhere('language_id', '=', $args['language'], '(')
            ->orWhere('language_id', '=', '0', false, ')')->fetchAllAssoc();
    }

    public function getProductGridData($rootValue, $args, Container $container, ResolveInfo $info)
    {
        $defaultArgs = [
            'language' => get_default_language_Id(),
            'limit' => 20,
            'page' => 1,
            'sortBy' => 'ASC',
            'orderBy' => 'product_id'
        ];
        $args += $defaultArgs;
        $collection = $container->get(Processor::class)
            ->getTable('product')
            ->leftJoin('product_description', null, [
                'column'      => "product_description.language_id",
                'operator'    => "=",
                'value'       => $args['language'],
                'ao'          => 'and',
                'start_group' => null,
                'end_group'   => null
            ])
            ->fetchAllAssoc($args);

        // get total

    }

    protected function productGidFilterParamParser(string $filter)
    {

    }
}