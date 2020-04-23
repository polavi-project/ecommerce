<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Tax\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class TaxRateType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Tax rate',
            'fields' => function() use ($container) {
                $fields = [
                    'tax_rate_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'tax_class_id' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'country' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'province' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'postcode' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'rate' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'is_compound' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'priority' => [
                        'type' => Type::int()
                    ],
                    'created_at' => [
                        'type' => Type::string()
                    ],
                    'updated_at' => [
                        'type' => Type::string()
                    ]
                ];

                dispatch_event('filter.tax_rate.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}