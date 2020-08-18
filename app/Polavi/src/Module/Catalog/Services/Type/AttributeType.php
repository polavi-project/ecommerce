<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;
use Polavi\Services\Db\Processor;
use Polavi\Services\Http\Request;
use Polavi\Services\Routing\Router;

class AttributeType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'ProductAttribute',
            'fields' => function () use ($container) {
                $fields = [
                    'attribute_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'attribute_code' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'attribute_name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'type' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'is_required' => [
                        'type' => Type::int()
                    ],
                    'display_on_frontend' => [
                        'type' => Type::int()
                    ],
                    'is_filterable' => [
                        'type' => Type::int()
                    ],
                    'sort_order' => [
                        'type' => Type::int()
                    ],
                    'options' => [
                        'type'=> Type::listOf($container->get(AttributeOptionType::class)),
                        'description' => 'List option value for dropdown attribute',
                        'resolve' => function ($attribute, $args, Container $container, ResolveInfo $info) {
                            if (!in_array($attribute['type'], ['select', 'multiselect'])) {
                                return [];
                            }
                            return $container->get(Processor::class)
                                ->getTable('attribute_option')
                                ->where('attribute_id', '=', $attribute['attribute_id'])
                                ->fetchAllAssoc();
                        }
                    ],
                    'editUrl' => [
                        'type' => Type::string(),
                        'resolve' => function ($attribute, $args, Container $container, ResolveInfo $info) {
                            if ($container->get(Request::class)->isAdmin() == false) {
                                return null;
                            }
                            return $container->get(Router::class)
                                ->generateUrl(
                                    'attribute.edit',
                                    ["id"=>$attribute['attribute_id']]
                                );
                        }
                    ],
                    'deleteUrl' => [
                        'type' => Type::string(),
                        'resolve' => function ($attribute, $args, Container $container, ResolveInfo $info) {
                            if ($container->get(Request::class)->isAdmin() == false) {
                                return null;
                            }
                            return $container->get(Router::class)
                                ->generateUrl(
                                    'attribute.delete',
                                    ["id"=>$attribute['attribute_id']]
                                );
                        }
                    ]
                ];

                dispatch_event('filter.attribute.type', [&$fields]);
                return $fields;
            },
            'resolveField' => function ($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}
