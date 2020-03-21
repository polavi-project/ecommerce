<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;

class CouponType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Coupon',
            'fields' => function() use ($container) {
                $fields = [
                    'coupon_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'status' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'description' => [
                        'type' => Type::string()
                    ],
                    'discount_amount' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'free_shipping' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'discount_type' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'coupon' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'used_time' => [
                        'type' => Type::int()
                    ],
                    'target_products' => [
                        'type' => Type::string()
                    ],
                    'condition' => [
                        'type' => Type::string()
                    ],
                    'user_condition' => [
                        'type' => Type::string()
                    ],
                    'buyx_gety' => [
                        'type' => Type::string()
                    ],
                    'max_uses_time_per_coupon' => [
                        'type' => Type::int()
                    ],
                    'max_uses_time_per_customer' => [
                        'type' => Type::int()
                    ],
                    'start_date' => [
                        'type' => Type::string()
                    ],
                    'end_date' => [
                        'type' => Type::string()
                    ],
                    'editUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($coupon, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('coupon.edit', ["id"=>$coupon['coupon_id']]);
                        }
                    ],
                    'deleteUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($coupon, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('coupon.delete', ["id"=>$coupon['coupon_id']]);
                        }
                    ]
                ];

                dispatch_event('filter.coupon.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}