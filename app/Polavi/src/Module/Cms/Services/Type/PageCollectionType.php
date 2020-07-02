<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;
use GraphQL\Type\Definition\Type;

class PageCollectionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'PageCollection',
            'fields' => function() use ($container){
                $fields = [
                    'pages' => [
                        'type' => Type::listOf($container->get(CmsPageType::class))
                    ],
                    'total' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'currentFilter' => Type::string()
                ];

                dispatch_event('filter.pageCollection.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }
}
