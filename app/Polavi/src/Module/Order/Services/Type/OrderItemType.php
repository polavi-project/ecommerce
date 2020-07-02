<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use Polavi\Module\Catalog\Services\Type\Price;
use Polavi\Module\Checkout\Services\Type\ItemCustomOptionType;
use Polavi\Services\Di\Container;
use Polavi\Services\Routing\Router;

class OrderItemType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Order item',
            'fields' => function() use ($container) {
                $fields = [
                    'order_item_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'product_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'product_sku' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'product_name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'product_weight' => [
                        'type' => Type::float()
                    ],
                    'product_price' => [
                        'type' => Type::nonNull($container->get(Price::class))
                    ],
                    'product_price_incl_tax' => [
                        'type' => Type::nonNull($container->get(Price::class))
                    ],
                    'qty' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'final_price' => [
                        'type' => Type::nonNull($container->get(Price::class))
                    ],
                    'final_price_incl_tax' => [
                        'type' => Type::nonNull($container->get(Price::class))
                    ],
                    'tax_percent' => [
                        'type' => Type::float()
                    ],
                    'tax_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'discount_amount' => [
                        'type' => $container->get(Price::class)
                    ],
                    'total' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'options' => [
                        'type' => Type::listOf($container->get(ItemCustomOptionType::class)),
                        'resolve' => function($item, $args, Container $container, ResolveInfo $info) {
                            if($item['product_custom_options'])
                                return json_decode($item['product_custom_options'], true);
                            else
                                return [];
                        }
                    ],
                    'requested_data' => [
                        'type' => Type::string()
                    ],
                    'product_url' => [
                        'type' => Type::string(),
                        'resolve' => function($item, $args, Container $container, ResolveInfo $info) {
                            $productSeo = _mysql()->getTable('product_description')->where('product_description_product_id', '=', $item['product_id']);
                            if(!$productSeo or !preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $productSeo['seo_key']))
                                return $container->get(Router::class)->generateUrl('product.view', ["id"=>$item['product_id']]);
                            else
                                return $container->get(Router::class)->generateUrl('product.view.pretty', ["slug"=>$productSeo['seo_key']]);
                        }
                    ]
                ];

                dispatch_event('filter.order_item.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}