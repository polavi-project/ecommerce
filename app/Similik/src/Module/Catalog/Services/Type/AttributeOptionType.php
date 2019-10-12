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
use Similik\Services\Event\Dispatcher;

class AttributeOptionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Attribute option',
            'fields' => function() use ($container) {
                $fields = [
                    'attribute_option_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'attribute_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'attribute_code' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'option_text' => [
                        'type' => Type::string()
                    ]
                ];

                dispatch_event('filter.attribute_option.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}
