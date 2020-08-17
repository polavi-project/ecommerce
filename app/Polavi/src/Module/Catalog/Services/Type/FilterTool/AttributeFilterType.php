<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services\Type\FilterTool;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Polavi\Services\Di\Container;

class AttributeFilterType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'AttributeFilterType',
            'fields' => function () use ($container){
                return [
                    'attribute_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'attribute_code' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'attribute_name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'options' => [
                        'type' => Type::listOf(new ObjectType([
                            'name' => "AttributeOptionFilter",
                            'fields' => function () {
                                return [
                                    'option_id' => [
                                        'type' => Type::nonNull(Type::int())
                                    ],
                                    'option_text' => [
                                        'type' => Type::nonNull(Type::string())
                                    ],
                                    'productCount' => [
                                        'type' => Type::nonNull(Type::int())
                                    ]
                                ];
                            }]))
                    ]
                ];
            },
            'resolveField' => function ($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }
}