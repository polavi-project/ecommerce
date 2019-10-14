<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class ItemOptionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'OrderItemOption',
            'fields' => function() use ($container) {
                $fields = [
                    'option_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'option_name' => [
                        'type' => Type::string()
                    ],
                    'option_value_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'option_value_text' => [
                        'type' => Type::string()
                    ],
                    'added_price' => [
                        'type' => Type::float()
                    ]
                ];

                dispatch_event('filter.OrderItemOption.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}