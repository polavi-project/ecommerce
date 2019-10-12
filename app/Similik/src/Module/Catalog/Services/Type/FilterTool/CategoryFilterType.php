<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type\FilterTool;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Similik\Services\Di\Container;

class CategoryFilterType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'CategoryFilterType',
            'fields' => function() use ($container){
                return [
                    'id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'parentId' => [
                        'type' => Type::int()
                    ],
                    'productCount' => [
                        'type' => Type::int()
                    ]
                ];
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }
}