<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Checkout\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class ItemVariantOptionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'CartItemVariantOption',
            'fields' => function() use ($container) {
                $fields = [
                    'attribute_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'attribute_name' => [
                        'type' => Type::string()
                    ],
                    'attribute_code' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'option_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'option_name' => [
                        'type' => Type::nonNull(Type::id())
                    ]
                ];

                dispatch_event('filter.cartItemVariantOption.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}