<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Similik\_mysql;
use function Similik\dispatch_event;
use Similik\Module\Catalog\Services\Type\FilterTool\AttributeFilterType;
use Similik\Module\Catalog\Services\Type\FilterTool\CategoryFilterType;
use Similik\Module\Catalog\Services\Type\FilterTool\PriceFilterType;
use Similik\Services\Di\Container;
use GraphQL\Type\Definition\Type;
use Similik\Services\Http\Request;

class ProductFilterToolType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'ProductFilterTool',
            'fields' => function() use ($container){
                $fields = [
                    'price' => [
                        'type' => $container->get(PriceFilterType::class),
                        'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                            if(!$value)
                                return [
                                    'minPrice' => 0,
                                    'maxPrice' => 0
                                ];
                            if($container->get(Request::class)->getCustomer()->isLoggedIn())
                                $customerGroupId = $container->get(Request::class)->getCustomer()->getData('group_id') ?? 1;
                            else
                                $customerGroupId = 999;
                            $conn = _mysql();
                            $priceData = $conn->getTable('product')
                                ->addFieldToSelect("product_price.tier_price")
                                ->leftJoin('product_price', null, [
                                    [
                                        'column'      => "product_price.customer_group_id",
                                        'operator'    => "=",
                                        'value'       => $customerGroupId,
                                        'ao'          => 'and',
                                        'start_group' => '(',
                                        'end_group'   => null
                                    ],
                                    [
                                        'column'      => "product_price.customer_group_id",
                                        'operator'    => "=",
                                        'value'       => 1000,
                                        'ao'          => 'or',
                                        'start_group' => null,
                                        'end_group'   => ')'
                                    ],
                                    [
                                        'column'      => "product_price.active_from",
                                        'operator'    => "IS",
                                        'value'       => null,
                                        'ao'          => 'and',
                                        'start_group' => '((',
                                        'end_group'   => null
                                    ],
                                    [
                                        'column'      => "product_price.active_from",
                                        'operator'    => "<=",
                                        'value'       => date("Y-m-d H:i:s"),
                                        'ao'          => 'or',
                                        'start_group' => null,
                                        'end_group'   => ')'
                                    ],
                                    [
                                        'column'      => "product_price.active_to",
                                        'operator'    => "IS",
                                        'value'       => null,
                                        'ao'          => 'and',
                                        'start_group' => '(',
                                        'end_group'   => null
                                    ],
                                    [
                                        'column'      => "product_price.active_to",
                                        'operator'    => ">=",
                                        'value'       => date("Y-m-d H:i:s"),
                                        'ao'          => 'or',
                                        'start_group' => null,
                                        'end_group'   => '))'
                                    ],
                                    [
                                        'column'      => "product_price.qty",
                                        'operator'    => "=",
                                        'value'       => 1,
                                        'ao'          => 'and',
                                        'start_group' => null,
                                        'end_group'   => null
                                    ],
                                    [
                                        'column'      => "product_price.tier_price",
                                        'operator'    => "<=",
                                        'value'       => "product.price",
                                        'isValueAColumn' => true,
                                        'ao'          => 'and',
                                        'start_group' => null,
                                        'end_group'   => null
                                    ]
                                ])
                                ->where('product_id', 'IN', $value)
                                ->fetchAllAssoc(['order_by'=> 'product_price.tier_price']);

                            $max = $priceData[0]['tier_price'];
                            $min = end($priceData)['tier_price'];

                            return [
                                'minPrice' => $min,
                                'maxPrice' => $max
                            ];
                        }
                    ],
                    'categories' => [
                        'type' => Type::listOf($container->get(CategoryFilterType::class))
                    ],
                    'attributes' => [
                        'type' => Type::listOf($container->get(AttributeFilterType::class)),
                        'resolve' => function($value, $args, Container $container, ResolveInfo $info) {

                            $conn = _mysql();
                            $attributeData = $conn->getTable('attribute')
                                ->addFieldToSelect("attribute.attribute_name", "attribute_name")
                                ->addFieldToSelect("attribute.type", "type")
                                ->addFieldToSelect("attribute.is_filterable", "is_filterable")
                                ->addFieldToSelect("product_attribute_value_index.attribute_id", "attribute_id")
                                ->addFieldToSelect("attribute.attribute_code", "attribute_code")
                                ->addFieldToSelect("product_attribute_value_index.option_id", 'option_id')
                                ->addFieldToSelect("product_attribute_value_index.attribute_value_text", 'option_text')
                                ->addFieldToSelect("COUNT(`product_attribute_value_index`.product_id)", 'productCount')
                                ->innerJoin('product_attribute_value_index')
                                ->where('product_attribute_value_index.product_id', 'IN', $value)
                                ->andWhere('type', 'IN', ['select', 'multiselect'])
                                ->andWhere('is_filterable', '=', 1)
                                ->groupBy('product_attribute_value_index.option_id')
                                ->fetchAllAssoc();
                            $result = [];
                            foreach ($attributeData as $key=>$attr) {
                                if(!isset($result[$attr['attribute_id']]))
                                    $result[$attr['attribute_id']] = [
                                        'attribute_name' => $attr['attribute_name'],
                                        'attribute_id' => $attr['attribute_id'],
                                        'attribute_code' => $attr['attribute_code']
                                    ];
                                $result[$attr['attribute_id']]['options'][] = [
                                    'option_id' => $attr['option_id'],
                                    'option_text' => $attr['option_text'],
                                    'productCount' => $attr['productCount']
                                ];
                            }

                            return $result;
                        }
                    ]
                ];

                dispatch_event('filter.productFilterTool.type', [&$fields]);

                return $fields;
            }
        ];

        parent::__construct($config);
    }
}
