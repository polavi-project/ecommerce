<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;
use Similik\Services\Db\Processor;

class CustomOptionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Product custom option',
            'fields' => function() use ($container) {
                $fields = [
                    'product_custom_option_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'product_custom_option_product_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'option_name' => [
                        'type' => Type::string()
                    ],
                    'option_type' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'is_required' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'sort_order' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'values' => [
                        'type' => Type::listOf($container->get(CustomOptionValueType::class)),
                        'description' => 'Product custom option value',
                        'resolve' => function($option, $args, Container $container, ResolveInfo $info) {
                            return $container->get(Processor::class)
                                ->getTable('product_custom_option_value')
                                ->where('option_id', '=', $option['product_custom_option_id'])
                                ->fetchAllAssoc();
                        }
                    ]
                ];

                dispatch_event('filter.custom_option.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}