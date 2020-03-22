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
use Similik\Module\Catalog\Services\ProductCollection;
use Similik\Services\Di\Container;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;

class CategoryType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Category',
            'fields' => function() use ($container) {
                $fields = [
                    'category_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'status' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'parent_id' => [
                        'type' => Type::int()
                    ],
                    'include_in_nav' => [
                        'type' => Type::int()
                    ],
                    'position' => [
                        'type' => Type::int()
                    ],
                    'name' => [
                        'type' => Type::string()
                    ],
                    'path' => [
                        'type' => Type::string()
                    ],
                    'description' => [
                        'type' => Type::string()
                    ],
                    'seo_key' => [
                        'type' => Type::string()
                    ],
                    'meta_title' => [
                        'type' => Type::string()
                    ],
                    'meta_description' => [
                        'type' => Type::string()
                    ],
                    'meta_keywords' => [
                        'type' => Type::string()
                    ],
                    'created_at' => [
                        'type' => Type::string()
                    ],
                    'updated_at' => [
                        'type' => Type::string()
                    ],
                    'url' => [
                        'type' => Type::string(),
                        'resolve' => function($category, $args, Container $container, ResolveInfo $info) {
                            if(!preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $category['seo_key']))
                                return $container->get(Router::class)->generateUrl('category.view', ["id"=>$category['category_id']]);
                            else
                                return $container->get(Router::class)->generateUrl('category.view.pretty', ["slug"=>$category['seo_key']]);
                        }
                    ],
                    'editUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($category, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('category.edit', ["id"=>$category['category_id']]);
                        }
                    ],
                    'deleteUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($category, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('category.delete', ["id"=>$category['category_id']]);
                        }
                    ]
                ];

                dispatch_event('filter.category.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}
