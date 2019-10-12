<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;
use GraphQL\Type\Definition\Type;

class CategoryCollectionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'CategoryCollection',
            'fields' => function() use ($container){
                $fields = [
                    'categories' => [
                        'type' => Type::listOf($container->get(CategoryType::class))
                    ],
                    'total' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'currentFilter' => Type::string()
                ];

                dispatch_event('filter.categoryCollection.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }
}
