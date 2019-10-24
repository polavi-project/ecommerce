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
use Similik\Module\Catalog\Services\DataLoader;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;

class AttributeGroupType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'AttributeGroup',
            'fields' => function() use ($container) {
                $fields = [
                    'attribute_group_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'group_name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'created_at' => [
                        'type' => Type::string()
                    ],
                    'updated_at' => [
                        'type' => Type::string()
                    ],
                    'attributes' => [
                        'type' => Type::listOf($container->get(AttributeType::class)),
                        'description' => 'List of attribute in the group',
                        'resolve' => function($group, $args, Container $container, ResolveInfo $info) {
                            return $container->get(DataLoader::class)->getAttributeByGroup($group, $args, $container, $info);
                        }
                    ],
                    'editUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($group, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('attribute.group.edit', ["id"=>$group['attribute_group_id']]);                        }
                    ]
                ];

                dispatch_event('filter.attributeGroup.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}
