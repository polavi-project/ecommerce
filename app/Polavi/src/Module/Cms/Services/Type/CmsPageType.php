<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Services\Routing\Router;


class CmsPageType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'CMSPage',
            'fields' => function() use ($container) {
                $fields = [
                    'cms_page_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'status' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'layout' => [
                        'type' => Type::string()
                    ],
                    'name' => [
                        'type' => Type::string()
                    ],
                    'content' => [
                        'type' => Type::string()
                    ],
                    'url_key' => [
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
                    'url' => [
                        'type' => Type::string(),
                        'resolve' => function($page, $args, Container $container, ResolveInfo $info) {
                            if(!preg_match('/^[\.a-zA-Z0-9\-_+]+$/', $page['url_key'] ?? ""))
                                return $container->get(Router::class)->generateUrl('page.view', ["id"=>$page['cms_page_id']]);
                            else
                                return $container->get(Router::class)->generateUrl('page.view.pretty', ["slug"=>$page['url_key']]);
                        }
                    ],
                    'editUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($page, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('page.edit', ["id"=>$page['cms_page_id']]);
                        }
                    ],
                    'deleteUrl' => [
                        'type' => Type::string(),
                        'resolve' => function($page, $args, Container $container, ResolveInfo $info) {
                            if($container->get(Request::class)->isAdmin() == false)
                                return null;
                            return $container->get(Router::class)->generateUrl('page.delete', ["id"=>$page['cms_page_id']]);
                        }
                    ]
                ];

                dispatch_event('filter.cmsPage.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}