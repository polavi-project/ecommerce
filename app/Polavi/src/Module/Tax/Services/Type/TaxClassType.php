<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Tax\Services\Type;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;

class TaxClassType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Tax class',
            'fields' => function() use ($container) {
                $fields = [
                    'tax_class_id' => [
                        'type' => Type::nonNull(Type::id())
                    ],
                    'name' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'created_at' => [
                        'type' => Type::int()
                    ],
                    'updated_at' => [
                        'type' => Type::string()
                    ],
                    'rates' => [
                        'type' => Type::listOf($container->get(TaxRateType::class)),
                        'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                            return _mysql()->getTable('tax_rate')->where('tax_class_id', '=', $value['tax_class_id'])->fetchAllAssoc();
                        }
                    ]
                ];

                dispatch_event('filter.tax_class.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];
        parent::__construct($config);
    }
}