<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;
use GraphQL\Type\Definition\Type;

class AttributeGroupCollectionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'AttributeGroupCollection',
            'fields' => function () use ($container) {
                $fields = [
                    'groups' => [
                        'type' => Type::listOf($container->get(AttributeGroupType::class))
                    ],
                    'total' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'currentFilter' => Type::string()
                ];

                dispatch_event('filter.attributeGroupCollection.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function ($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }
}
