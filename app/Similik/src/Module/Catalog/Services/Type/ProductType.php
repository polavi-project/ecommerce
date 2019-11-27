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
use Similik\Services\Di\Container;
use Similik\Services\Db\Processor;
use Similik\Services\Db\Table;
use GraphQL\Type\Definition\Type;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;

class ProductType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Product',
            'fields' => function() use ($container){
                $fields = [
                    'product_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'sku' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'price' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'salePrice' => [
                        'type' => Type::nonNull(Type::float()),
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            if(isset($product['tier_price']))
                                return $product['tier_price'];
                            return $product['price'];
                        }
                    ],
                    'categories' => [
                        'type' => Type::listOf(new ObjectType([
                            'name'=> "Product's categories",
                            'fields' => [
                                'category_id' => Type::nonNull(Type::int()),
                                'parent_id' => Type::int(),
                                'name' => Type::string(),
                                'status'=> Type::int()
                            ]
                        ])),
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            $categoryIds = [];
                            $conn = _mysql();
                            $stmt = $conn->getTable('product_category')->where('product_id', '=', (int)$product['product_id']);
                            while ($row = $stmt->fetch()) {
                                $categoryIds[] = $row['category_id'];
                            }
                            if(!$categoryIds)
                                return null;
                             //Problem is here, DataLoader?
                            $categoryTable = new Table('category', $container->get(Processor::class));
                            $categoryTable->leftJoin('category_description', null, [
                                [
                                    'column'      => "category_description.language_id",
                                    'operator'    => "=",
                                    'value'       => $product['language_id'],
                                    'ao'          => 'and',
                                    'start_group' => null,
                                    'end_group'   => null
                                ]
                            ]);
                            return $categoryTable->where('category.category_id', 'IN', $categoryIds)->fetchAllAssoc();
                        }
                    ],
                    'weight' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'qty' => [
                        'type' => Type::int(),
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $product['qty'];
                        }
                    ],
                    'manage_stock' => [
                        'type' => Type::int(),
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $product['manage_stock'];
                        }
                    ],
                    'stock_availability' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'tax_class' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'status' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'image' => [
                        'type' => $container->get(ProductImageType::class),
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            return $product['image'] ? ['path' => $product['image'], 'isMain'=> true] : [];
                        }
                    ],
                    'name' => [
                        'type' => Type::string()
                    ],
                    'short_description' => [
                        'type' => Type::string()
                    ],
                    'description' => [
                        'type' => Type::string()
                    ],
                    'seo_key' => [
                        'type' => Type::string()
                    ],
                    'url' => [
                        'type' => Type::string(),
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            if(!preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $product['seo_key']))
                                return $container->get(Router::class)->generateUrl('product.view', ["id"=>$product['product_id']]);
                            else
                                return $container->get(Router::class)->generateUrl('product.view.pretty', ["slug"=>$product['seo_key']]);
                        }
                    ],
                    'editUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('product.edit', ["id"=>$product['product_id']]);                        }
                    ],
                    'meta_title' => [
                        'type' => Type::string()
                    ],
                    'meta_description' => [
                        'type' => Type::string()
                    ],
                    'meta_keywords' => [
                        'type' => Type::string()
                    ],
                    'group_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'options' => [
                        'type' => Type::listOf($container->get(CustomOptionType::class)),
                        'description' => 'List of custom option',
                        'resolve' => function($product, $args, Container $container, ResolveInfo $info) {
                            return $container->get(Processor::class)
                                ->getTable('product_custom_option')
                                ->where('product_custom_option_product_id', '=', $product['product_id'])
                                ->fetchAllAssoc();
                        }
                    ],
                    'created_at' => [
                        'type' => Type::string()
                    ],
                    'updated_at' => [
                        'type' => Type::string()
                    ]
                ];

                dispatch_event('filter.product.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }

}
