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

class ProductAttributeIndex extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Product attribute index',
            'fields' => function() use ($container) {
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
                    'attribute_name' => [
                        'type' => Type::string()
                    ],
                    'option_id' => [
                        'type' => Type::int()
                    ],
                    'attribute_value_text' => [
                        'type' => Type::string()
                    ],
                    'language_id' => [
                        'type' => Type::nonNull(Type::int())
                    ]
                ];

                dispatch_event('filter.product_attribute_index.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}
