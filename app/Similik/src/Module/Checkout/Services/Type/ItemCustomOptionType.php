<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class ItemCustomOptionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'CartItemCustomOption',
            'fields' => function() use ($container) {
                $fields = [
                    'option_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'option_name' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'values' => [
                        'type' => Type::listOf($container->get(ItemCustomOptionValueType::class))
                    ]
                ];

                dispatch_event('filter.cartItemCustomOption.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}