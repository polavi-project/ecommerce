<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;
use GraphQL\Type\Definition\Type;

class CustomerGridType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'Customer grid',
            'fields' => function() use ($container){
                $fields = [
                    'customers' => [
                        'type' => Type::listOf($container->get(CustomerType::class))
                    ],
                    'total' => [
                        'type' => Type::nonNull(Type::int())
                    ]
                ];

                dispatch_event('filter.customer_grid.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }
}
