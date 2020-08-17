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

class ProductAttributeIndex extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'ProductAttributeIndex',
            'fields' => function () use ($container) {
                $fields = [
                    'product_attribute_value_index_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'product_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'attribute_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'attribute_code' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'attribute_name' => [
                        'type' => Type::string()
                    ],
                    'option_id' => [
                        'type' => Type::int()
                    ],
                    'attribute_value_text' => [
                        'type' => Type::string()
                    ]
                ];

                dispatch_event('filter.productAttributeIndex.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function ($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}
