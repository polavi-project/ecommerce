<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

/** @var \Similik\Services\Event\EventDispatcher $eventDispatcher */

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Module\Catalog\Services\ProductCollection;
use Similik\Module\Catalog\Services\Type\ProductCollectionFilterType;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;

$eventDispatcher->addListener(
        'register.core.middleware',
        function (\Similik\Services\MiddlewareManager $middlewareManager) {
            $middlewareManager->registerMiddleware(\Similik\Module\Catalog\Middleware\Core\AddCatalogMenuMiddleware::class, 81);
        },
        0
);

$eventDispatcher->addListener(
    'add_widget_type',
    function (&$types) {
        $types[] = ['code' => 'product_filter', 'name' => 'Product Filter'];
        $types[] = ['code' => 'featured_products', 'name' => 'Featured Products'];
    },
    0
);

$eventDispatcher->addListener('register.widget.grid.middleware', function(\Similik\Services\MiddlewareManager $mm) {
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\FeaturedProduct\EditMiddleware::class, 1);
    $mm->registerMiddleware(\Similik\Module\Catalog\Middleware\Widget\ProductFilter\EditMiddleware::class, 1);
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
                    //->addFieldToSelect("DISTINCT(qty)", "qty")
                    //->addFieldToSelect("MIN(price)", "price")
                    //->addFieldToSelect("active_from")
                    //->addFieldToSelect("active_to")
                    //->groupBy('qty')
                    ->where('product_price_product_id', '=', $args['productId']);

                if(!$container->get(Request::class)->isAdmin()) {
                    $query->andWhere('active_from', 'IS', null, '((')
                        ->orWhere('active_from', '<', date("Y-m-d H:i:s"), null, ')')
                        ->andWhere('active_to', 'IS', null, '(')
                        ->orWhere('active_to', '>', date("Y-m-d H:i:s"), null, '))');

                    $customerGroupId = $container->get(Request::class)->getCustomer() ? $container->get(Request::class)->getCustomer()->getData('group_id') ?? 3 : 3;
                    $query->andWhere('customer_group_id', '=', $customerGroupId);
                }

                if(isset($args['qty']))
                    $query->andWhere('qty', '>=', $args['qty']);
                else
                    $query->andWhere('qty', '>=', 1);

                return $query->fetchAllAssoc(['sort_by'=>'qty', 'sort_order'=>'ASC']);
            }
        ];
    },
    5
);

$eventDispatcher->addListener(
    'filter.mutation.type',
    function (&$fields, Container $container) {
        $fields['deleteProduct'] = [
            'args' => [
                'productId' => Type::nonNull(Type::int())
            ],
            'type' => new ObjectType([
                'name'=> 'deleteProductOutput',
                'fields' => [
                    'status' => Type::nonNull(Type::boolean()),
                    'message'=> Type::string(),
                    'product' => new ObjectType([
                        'name' => 'deletedProduct',
                        'fields' => [
                            'id' => Type::nonNull(Type::int()),
                            'sku' => Type::string(),
                            'name'=> Type::string()
                        ]
                    ])
                ]
            ]),
            'resolve' => function($rootValue, $args, Container $container, ResolveInfo $info) {
                $conn = _mysql();
                if(
                    $container->get(Request::class)->isAdmin() == false
                )
                    return ['status'=> false, 'product' => null, 'message' => 'Permission denied'];
                \Similik\dispatch_event("before_delete_product", [$args]);
                $product = $conn->getTable('product')->leftJoin('product_description', null, [
                    [
                        'column'      => "product_description.language_id",
                        'operator'    => "=",
                        'value'       => get_default_language_Id(),
                        'ao'          => 'and',
                        'start_group' => null,
                        'end_group'   => null
                    ]
                ])->load($args['productId']);

                if(!$product)
                    return ['status'=> false, 'product' => null, 'message' => 'Requested product does not exist'];
                $conn->getTable('product')->where('product_id', '=', $args['productId'])->delete();
                $result = [
                    'status'=> true,
                    'product' => ['id' => $args['productId'], 'sku' => $product['sku'], 'name' => $product['name']],
                    'message' => null
                ];
                \Similik\dispatch_event("after_delete_product", [$result]);
                // TODO: use promises here to support side effect
                return $result;
            }
        ];
    },
    5
);

$eventDispatcher->addListener(
    'before_execute_' . strtolower(str_replace('\\', '_', \Similik\Middleware\AdminNavigationMiddleware::class)),
    function (\Similik\Services\Di\Container $container) {
        $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
            'product_attribute_group',
            'Attribute groups',
            \Similik\generate_url('attribute.group.grid'),
            'file-text',
            'catalog',
            99
        );
        $container->get(\Similik\Module\Cms\Services\NavigationManager::class)->addItem(
            'product_attribute',
            'Attribute',
            \Similik\generate_url('attribute.grid'),
            'tag',
            'catalog',
            100
        );
    },
    0
);