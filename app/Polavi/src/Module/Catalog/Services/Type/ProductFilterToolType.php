<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use Polavi\Module\Catalog\Services\Type\FilterTool\AttributeFilterType;
use Polavi\Module\Catalog\Services\Type\FilterTool\CategoryFilterType;
use Polavi\Module\Catalog\Services\Type\FilterTool\PriceFilterType;
use Polavi\Services\Di\Container;
use GraphQL\Type\Definition\Type;
use Polavi\Services\Http\Request;

class ProductFilterToolType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'ProductFilterTool',
            'fields' => function () use ($container){
                $fields = [
                    'price' => [
                        'type' => $container->get(PriceFilterType::class),
                        'resolve' => function ($value, $args, Container $container, ResolveInfo $info) {
                            if (!$value) {
                                return [
                                    'minPrice' => 0,
                                    'maxPrice' => 0
                                ];
                            }
                            if ($container->get(Request::class)->getCustomer()->isLoggedIn()) {
                                $customerGroupId = $container->get(Request::class)
                                        ->getCustomer()
                                        ->getData('group_id') ?? 1;
                            } else {
                                $customerGroupId = 999;
                            }
                            $conn = _mysql();
                            $priceData = $conn->getTable('product')
                                ->setFieldToSelect(
                                    "LEAST(product.`price`, IF(ppone.`tier_price` IS NULL, 1000000000, ppone.`tier_price`) , IF(pptwo.`tier_price` IS NULL, 1000000000, pptwo.`tier_price`))",
                                    "sale_price"
                                )
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
                                ])
                                ->where('product_id', 'IN', $value)
                                ->fetchAllAssoc(['sort_by'=> 'sale_price']);

                            $max = $priceData[0]['sale_price'];
                            $min = end($priceData)['sale_price'];

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
                        'resolve' => function ($value, $args, Container $container, ResolveInfo $info) {

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
                            foreach ($attributeData as $key => $attr) {
                                if (!isset($result[$attr['attribute_id']])) {
                                    $result[$attr['attribute_id']] = [
                                        'attribute_name' => $attr['attribute_name'],
                                        'attribute_id' => $attr['attribute_id'],
                                        'attribute_code' => $attr['attribute_code']
                                    ];
                                }
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
