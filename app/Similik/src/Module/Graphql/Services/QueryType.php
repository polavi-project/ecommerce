<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Services;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use function Similik\dispatch_event;
use Similik\Module\Catalog\Services\CategoryCollection;
use Similik\Module\Catalog\Services\ProductCollection;
use Similik\Module\Catalog\Services\Type\CategoryCollectionFilterType;
use Similik\Module\Catalog\Services\Type\CategoryCollectionType;
use Similik\Module\Catalog\Services\Type\ProductCollectionFilterType;
use Similik\Module\Catalog\Services\Type\ProductCollectionType;
use Similik\Module\Discount\Services\CouponCollection;
use Similik\Module\Catalog\Services\DataLoader;
use Similik\Module\Catalog\Services\Type\AttributeGroupType;
use Similik\Module\Catalog\Services\Type\CategoryType;
use Similik\Module\Catalog\Services\Type\ProductAttributeIndex;
use Similik\Module\Catalog\Services\Type\ProductType;
use Similik\Module\Checkout\Services\Cart\Cart;
use Similik\Module\Checkout\Services\Type\CartType;
use Similik\Module\Discount\Services\Type\CouponCollectionFilterType;
use Similik\Module\Discount\Services\Type\CouponCollectionType;
use Similik\Module\Discount\Services\Type\CouponType;
use Similik\Module\Order\Services\OrderCollection;
use Similik\Module\Order\Services\Type\OrderCollectionFilterType;
use Similik\Module\Order\Services\Type\OrderCollectionType;
use Similik\Module\Order\Services\Type\OrderType;
use Similik\Module\Tax\Services\Type\TaxClassType;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;

class QueryType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
        'name' => 'Query',
        'fields' => function() use ($container) {
            $fields = [
                'product' => [
                    'type' => $container->get(ProductType::class),
                    'description' => 'Return a product',
                    'args' => [
                        'id' => Type::nonNull(Type::id()),
                        'language' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($product, $args, Container $container, ResolveInfo $info)  {
                        //echo "running";
                        $productTable = _mysql()->getTable('product');
                        $productTable->leftJoin('product_description', null, [
                            [
                                'column'      => "product_description.language_id",
                                'operator'    => "=",
                                'value'       => $args['language'],
                                'ao'          => 'and',
                                'start_group' => null,
                                'end_group'   => null
                            ]
                        ]);
                        $productTable->where('product.product_id', '=', $args['id']);
                        if($container->get(Request::class)->isAdmin() == false)
                            $productTable->andWhere('product.status', '=', 1);

                        return $productTable->fetchOneAssoc();
                    }
                ],
                'productCollection' => [
                    'type' => $container->get(ProductCollectionType::class),
                    'description' => "Return list of products and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(ProductCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
//                        if($container->get(Request::class)->isAdmin() == false)
//                            return [];
//                        else
                            return $container->get(ProductCollection::class)->getData($rootValue, $args, $container, $info);
                    }
                ],
                'category' => [
                    'type' => $container->get(CategoryType::class),
                    'description' => 'Return a category',
                    'args' => [
                        'id' => Type::nonNull(Type::id()),
                        'language' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                        $categoryTable = _mysql()->getTable('category');
                        $categoryTable->leftJoin('category_description', null, [
                            [
                                'column'      => "category_description.language_id",
                                'operator'    => "=",
                                'value'       => $args['language'],
                                'ao'          => 'and',
                                'start_group' => null,
                                'end_group'   => null
                            ]
                        ]);
                        return $categoryTable->where('category.category_id', '=', $args['id'])->fetchOneAssoc();
                    }
                ],
                'categoryCollection' => [
                    'type' => $container->get(CategoryCollectionType::class),
                    'description' => "Return list of categories and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(CategoryCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
//                        if($container->get(Request::class)->isAdmin() == false)
//                            return [];
//                        else
                        return $container->get(CategoryCollection::class)->getData($rootValue, $args, $container, $info);
                    }
                ],
                'attribute_groups' => [
                    'type' => Type::listOf($container->get(AttributeGroupType::class)),
                    'description' => 'Return a list of product attribute group',
                    'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                        return $container->get(DataLoader::class)->getAllAttributeGroup($value, $args, $container, $info);
                    }
                ],
                'product_attribute_index' => [
                    'type' => Type::listOf($container->get(ProductAttributeIndex::class)),
                    'description' => 'Return attribute value of a specified product',
                    'args' => [
                        'product_id' => Type::nonNull(Type::id()),
                        'language' => Type::nonNull(Type::id())
                    ],
                    'resolve' => [$container->get(DataLoader::class), 'getProductAttributeIndex']
                ],
                'order' => [
                    'type' => $container->get(OrderType::class),
                    'description' => "Return an order",
                    'args' => [
                        'id' =>  Type::nonNull(Type::int())
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        // Authentication example
                        if($container->get(Request::class)->isAdmin() == false)
                            return null;
                        else
                            return _mysql()->getTable('order')->load($args['id']);
                    }
                ],
                'orderCollection' => [
                    'type' => $container->get(OrderCollectionType::class),
                    'description' => "Return list of order and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(OrderCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        if($container->get(Request::class)->isAdmin() == false)
                            return [];
                        else
                            return $container->get(OrderCollection::class)->getData($rootValue, $args, $container, $info);
                    }
                ],
                'cart' => [
                    'type'=> $container->get(CartType::class),
                    'description' => 'Return shopping cart',
                    'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                        return $container->get(Cart::class)->toArray();
                    }
                ],
                'taxClass' => [
                    'type' => $container->get(TaxClassType::class),
                    'description' => "Return a tax class",
                    'args' => [
                        'id' =>  Type::nonNull(Type::int())
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        // Authentication example
                        if($container->get(Request::class)->isAdmin() == false)
                            return null;
                        else
                            return _mysql()->getTable('tax_class')->load($args['id']);
                    }
                ],
                'taxClasses' => [
                    'type' => Type::listOf($container->get(TaxClassType::class)),
                    'description' => "Return all tax class",
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        // Authentication example
                        if($container->get(Request::class)->isAdmin() == false)
                            return [];
                        else
                            return _mysql()->getTable('tax_class')->fetchAllAssoc();
                    }
                ],
                'coupon' => [
                    'type' => $container->get(CouponType::class),
                    'description' => 'Return a coupon',
                    'args' => [
                        'id' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                        if($container->get(Request::class)->isAdmin() == false)
                            return false;

                        return _mysql()->getTable('coupon')->load($args['id']);
                    }
                ],
                'couponCollection' => [
                    'type' => $container->get(CouponCollectionType::class),
                    'description' => "Return list of coupon and total count",
                    'args' => [
                        'filter' =>  [
                            'type' => $container->get(CouponCollectionFilterType::class)
                        ]
                    ],
                    'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                        if($container->get(Request::class)->isAdmin() == false)
                            return [];
                        else
                            return $container->get(CouponCollection::class)->getData($rootValue, $args, $container, $info);
                    }
                ]
            ];

            dispatch_event('filter.query.type', [&$fields, $container]);

            return $fields;
        },
        'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
            return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
        }
    ];
        parent::__construct($config);
    }
}
