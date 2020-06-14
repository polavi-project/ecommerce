<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use function Similik\get_current_language_id;
use function Similik\get_default_language_Id;
use Similik\Module\Catalog\Services\ProductCollection;
use Similik\Module\Catalog\Services\Type\ProductCollectionFilterType;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;

$eventDispatcher->addListener(
    'widget_types',
    function ($types) {
        $types[] = ['code' => 'product_filter', 'name' => 'Product Filter'];
        $types[] = ['code' => 'featured_products', 'name' => 'Featured Products'];

        return $types;
    },
    0
);

$eventDispatcher->addListener(
    'sorting_options',
    function ($options) {
        $options[] = ['code' => 'price', 'name' => 'Price'];
        $options[] = ['code' => 'created_at', 'name' => 'Created date'];

        return $options;
    },
    0
);

$eventDispatcher->addListener('register.widget.create.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\FeaturedProduct\FormMiddleware::class, 0);
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\ProductFilter\FormMiddleware::class, 0);
});

$eventDispatcher->addListener('register.widget.edit.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\FeaturedProduct\FormMiddleware::class, 0);
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\ProductFilter\FormMiddleware::class, 0);
});

$eventDispatcher->addListener('register.core.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\FeaturedProduct\FeaturedProductWidgetMiddleware::class, 21);
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\ProductFilter\ProductFilterWidgetMiddleware::class, 21);
});

$eventDispatcher->addListener(
    'filter.query.type',
    function (&$fields, Container $container) {
        $fields['productFilterTool'] = [
            'type' => $container->get(\Similik\Module\Catalog\Services\Type\ProductFilterToolType::class),
            'description' => "Return data for product filter widget",
            'args' => [
                'filter' =>  [
                    'type' => $container->get(ProductCollectionFilterType::class)
                ]
            ],
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                // Get the root product collection filter
                $filter = $container->get(Symfony\Component\HttpFoundation\Session\Session::class)->get("productCollectionQuery");
                $args["filter"] = $args["filter"] ?? $filter;
                return $container->get(ProductCollection::class)->getProductIdArray($rootValue, $args, $container, $info);
            }
        ];

        $fields['productImages'] = [
            'type' => new ObjectType([
                'name' => "ProductImageList",
                'fields' => [
                    'images' => Type::listOf($container->get(\Similik\Module\Catalog\Services\Type\ProductImageType::class)),
                    'productName' => Type::string()
                ],
                'resolveField' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                    return isset($rootValue[$info->fieldName]) ? $rootValue[$info->fieldName] : null;
                }
            ]),
            'description' => "Return a list of product image",
            'args' => [
                'productId' =>  Type::nonNull(Type::int())
            ],
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                $mainImage = $conn->getTable('product')->addFieldToSelect('image')->where('product_id', '=', $args['productId'])->fetchOneAssoc();
                $result['images'] = [];
                if($mainImage['image'])
                    $result['images'][] = ['path' => $mainImage['image'], 'isMain'=> true];
                $stm = $conn->getTable('product_image')
                    ->addFieldToSelect('image')
                    ->where('product_image_product_id', '=', $args['productId'])
                    ->fetchAllAssoc();
                foreach ($stm as $row)
                    $result['images'][] = ['path'=>$row['image']];
                $productName = $conn->getTable('product_description')
                    ->where('product_description_product_id', '=', $args['productId'])
                    ->andWhere('language_id', '=', get_default_language_Id())
                    ->fetchOneAssoc();
                if($productName)
                    $result['productName'] = $productName['name'];

                return $result;
            }
        ];

        $fields['productTierPrice'] = [
            'type' => Type::listOf($container->get(\Similik\Module\Catalog\Services\Type\ProductTierPriceType::class)),
            'description' => "Return a list of product tier price",
            'args' => [
                'productId' =>  Type::nonNull(Type::int()),
                'qty' =>  Type::int(),
            ],
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $query = _mysql()->getTable('product_price')
                    ->where('product_price_product_id', '=', $args['productId']);
                $query->andWhere('customer_group_id', '<', 1000);
                if(!$container->get(Request::class)->isAdmin()) {
                    $query->andWhere('active_from', 'IS', null, '((')
                        ->orWhere('active_from', '<', date("Y-m-d H:i:s"), null, ')')
                        ->andWhere('active_to', 'IS', null, '(')
                        ->orWhere('active_to', '>', date("Y-m-d H:i:s"), null, '))');

                    $customerGroupId = $container->get(Request::class)->getCustomer()->isLoggedIn() ? $container->get(Request::class)->getCustomer()->getData('group_id') ?? 1 : 999;
                    $query->andWhere('customer_group_id', '=', $customerGroupId);
                }

                if(isset($args['qty']))
                    $query->andWhere('qty', '>=', $args['qty']);
                else
                    $query->andWhere('qty', '>=', 1);

                return $query->fetchAllAssoc(['sort_by'=>'qty', 'sort_order'=>'ASC']);
            }
        ];

        $fields['potentialVariants'] = [
            'type' => Type::listOf($container->get(\Similik\Module\Catalog\Services\Type\ProductType::class)),
            'description' => "Return a list of potential variants",
            'args' => [
                'attributeGroupId' =>  Type::nonNull(Type::int()),
                'name' => Type::string()
            ],
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                if(!$args['name'])
                    return _mysql()->getTable("product")
                        ->leftJoin('product_description', null, [
                            [
                                "column"      => "product_description.language_id",
                                "operator"    => "=",
                                "value"       => get_current_language_id(),
                                "ao"          => 'and',
                                "start_group" => null,
                                "end_group"   => null
                            ]
                        ])
                        ->where("product.group_id", "=", $args["attributeGroupId"])
                        ->andWhere("product.variant_group_id", "IS", null)
                        ->fetchAssoc(["limit" => 100]);
                else
                    return _mysql()->getTable("product")
                        ->leftJoin('product_description', null, [
                            [
                                "column"      => "product_description.language_id",
                                "operator"    => "=",
                                "value"       => get_current_language_id(),
                                "ao"          => 'and',
                                "start_group" => null,
                                "end_group"   => null
                            ]
                        ])
                        ->where("product.group_id", "=", $args["attributeGroupId"])
                        ->andWhere("product.variant_group_id", "IS", null)
                        ->andWhere("product_description.name", "LIKE", "%{$args["name"]}%")
                        ->fetchAssoc(["limit" => 100]);
            }
        ];
    },
    5
);

$eventDispatcher->addListener(
    "admin_menu",
    function (array $items) {
        return array_merge($items, [
            [
                "id" => "product_add_new",
                "sort_order" => 10,
                "url" => \Similik\generate_url("product.create"),
                "title" => "New Product",
                "icon" => "cubes",
                "parent_id" => "quick_links"
            ],
            [
                "id" => "catalog",
                "sort_order" => 10,
                "url" => null,
                "title" => "Catalog",
                "parent_id" => null
            ],
            [
                "id" => "catalog_products",
                "sort_order" => 10,
                "url" => \Similik\generate_url("product.grid"),
                "title" => "Products",
                "icon" => "boxes",
                "parent_id" => "catalog"
            ],
            [
                "id" => "catalog_categories",
                "sort_order" => 20,
                "url" => \Similik\generate_url("category.grid"),
                "title" => "Categories",
                "icon" => "tags",
                "parent_id" => "catalog"
            ],
            [
                "id" => "catalog_attributes",
                "sort_order" => 30,
                "url" => \Similik\generate_url("attribute.grid"),
                "title" => "Attributes",
                "icon" => "ruler-combined",
                "parent_id" => "catalog"
            ],
            [
                "id" => "catalog_attribute_groups",
                "sort_order" => 40,
                "url" => \Similik\generate_url("attribute.group.grid"),
                "title" => "Attribute groups",
                "icon" => "tags",
                "parent_id" => "catalog"
            ]
        ]);
    },
    0
);

$eventDispatcher->addListener('before_delete_attribute_group', function($rows) {
   foreach ($rows as $row) {
       if($row['attribute_group_id'] == 1)
           throw new Exception("Can not delete 'Default' attribute group");
   }
});

$eventDispatcher->addListener(
    'filter.mutation.type',
    function (&$fields, Container $container) {
        $fields['unlinkVariant'] = [
            'args' => [
                'productId' => Type::nonNull(Type::int())
            ],
            'type' => new ObjectType([
                'name'=> 'unlinkVariantOutPut',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'productId' => Type::int()
                ]
            ]),
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                if(
                    $container->get(Request::class)->isAdmin() == false
                )
                    return ['status'=> false, 'message' => 'Permission denied'];
                $product = $conn->getTable("product")->load($args['productId']);

                if(!$product)
                    return ['status'=> true, 'message' => 'Product does not exist'];

                $conn->getTable("product")->where("product_id", "=", $args["productId"])->update(["variant_group_id"=> null, "visibility" => null]);
                return ['status'=> true, 'productId' => $args["productId"]];
            }
        ];
    },
    5
);