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
use function Polavi\get_base_url_scheme_less;
use Polavi\Services\Di\Container;
use function Polavi\str_replace_last;
use Symfony\Component\Filesystem\Filesystem;

class ProductImageType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'ProductImage',
            'fields' => function() use ($container) {
                $fileSystem = new Filesystem();
                $fields = [
                    'path' => [
                        'type' => Type::string(),
                        'resolve' => function($image, $args, Container $container, ResolveInfo $info) use ($fileSystem) {
                            return $image['path'] ?? null;
                        }
                    ],
                    'image' => [
                        'type' => Type::string(),
                        'resolve' => function($image, $args, Container $container, ResolveInfo $info) use ($fileSystem) {
                            if (!isset($image['path']) or $image['path'] == null)
                                return null;
                            if (!$fileSystem->exists(MEDIA_PATH . DS . $image['path']))
                                return null;

                            return get_base_url_scheme_less(false) . "/public/media/" . $image['path'];
                        }
                    ],
                    'thumb' => [
                        'type' => Type::string(),
                        'resolve' => function($image, $args, Container $container, ResolveInfo $info) use ($fileSystem) {
                            if (!isset($image['path']) or $image['path'] == null)
                                return null;
                            if ($fileSystem->exists(MEDIA_PATH . DS . str_replace_last('.', '_thumb.', $image['path'])))
                                return get_base_url_scheme_less(false) . "/public/media/" . str_replace_last('.', '_thumb.', $image['path']);
                            else
                                return null;
                        }
                    ],
                    'list' => [
                        'type' => Type::string(),
                        'resolve' => function($image, $args, Container $container, ResolveInfo $info) use ($fileSystem) {
                            if (!isset($image['path']) or $image['path'] == null)
                                return null;
                            if ($fileSystem->exists(MEDIA_PATH . DS . str_replace_last('.', '_list.', $image['path'])))
                                return get_base_url_scheme_less(false) . "/public/media/" . str_replace_last('.', '_list.', $image['path']);
                            else
                                return null;
                        }
                    ],
                    'main' => [
                        'type' => Type::string(),
                        'resolve' => function($image, $args, Container $container, ResolveInfo $info) use ($fileSystem) {
                            if (!isset($image['path']) or $image['path'] == null)
                                return null;
                            if ($fileSystem->exists(MEDIA_PATH . DS . str_replace_last('.', '_main.', $image['path'])))
                                return get_base_url_scheme_less(false) . "/public/media/" . str_replace_last('.', '_main.', $image['path']);
                            else
                                return null;
                        }
                    ],
                    'isMain' => [
                        'type' => Type::boolean(),
                        'resolve' => function($image, $args, Container $container, ResolveInfo $info) use ($fileSystem) {
                            return $image['isMain'] ?? false;
                        }
                    ]
                ];

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}
