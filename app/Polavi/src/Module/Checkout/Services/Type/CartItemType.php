<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use Polavi\Module\Catalog\Services\Type\Price;
use Polavi\Services\Di\Container;
use Polavi\Services\Routing\Router;

class CartItemType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Cart item',
            'fields' => function() use ($container) {
                $fields = [
                    'cart_item_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'product_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'product_name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'product_thumbnail' => [
                        'type' => Type::string()
                    ],
                    'product_sku' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'product_weight' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'product_price' => [
                        'type' => $container->get(Price::class)
                    ],
                    'product_price_incl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'qty' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'final_price' => [
                        'type' => $container->get(Price::class)
                    ],
                    'final_price_incl_tax' => [
                        'type' => $container->get(Price::class)
                    ],
                    'tax_percent' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'tax_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'discount_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'product_custom_options' => [
                        'type' => Type::listOf($container->get(ItemCustomOptionType::class))
                    ],
                    'variant_options' => [
                        'type' => Type::listOf($container->get(ItemVariantOptionType::class))
                    ],
                    'total' => [
                        'type' => Type::nonNull($container->get(Price::class))
                    ],
                    'productUrl' => [
                        'type' => Type::nonNull(Type::string()),
                        'resolve' => function($item, $args, Container $container, ResolveInfo $info) {
                            $des = _mysql()->getTable('product_description')
                                ->where('product_description_product_id', '=', $item['product_id'])
                                ->fetchOneAssoc();
                            if(!preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $des['seo_key']))
                                return $container->get(Router::class)->generateUrl('product.view', ["id"=>$item['product_id']]);
                            else
                                return $container->get(Router::class)->generateUrl('product.view.pretty', ["slug"=>$des['seo_key']]);
                        }
                    ],
                    'removeUrl' => [
                        'type' => Type::nonNull(Type::string()),
                        'resolve' => function($item, $args, Container $container, ResolveInfo $info) {
                            return $container->get(Router::class)->generateUrl('cart.remove', ["id"=>$item['cart_item_id']]);                        }
                    ],
                    'error' => [
                        'type' => Type::listOf(new ObjectType([
                            'name'=> 'cartItemError',
                            'fields' => [
                                'field' => Type::string(),
                                'message'=> Type::string()
                            ]
                        ])),
                        'resolve' => function($item, $args, Container $container, ResolveInfo $info) {
                            $errors = [];
                            if($item['error'])
                                foreach ($item['error'] as $key => $val)
                                    $errors[] = ['field'=> $key, 'message'=> $val];
                            return $errors;
                        }
                    ]
                ];

                dispatch_event('filter.cart_item.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}