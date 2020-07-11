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

class CustomOptionValueType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Product custom option value',
            'fields' => function() use ($container) {
                $fields = [
                    'product_custom_option_value_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'option_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'extra_price' => [
                        'type' => Type::float()
                    ],
                    'value' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'sort_order' => [
                        'type' => Type::nonNull(Type::int())
                    ]
                ];

                dispatch_event('filter.custom_option_value.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}