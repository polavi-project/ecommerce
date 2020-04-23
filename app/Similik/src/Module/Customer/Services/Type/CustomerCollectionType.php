<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Services\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;
use GraphQL\Type\Definition\Type;

class CustomerCollectionType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'CustomerCollection',
            'fields' => function() use ($container){
                $fields = [
                    'customers' => [
                        'type' => Type::listOf($container->get(CustomerType::class))
                    ],
                    'total' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'currentFilter' => Type::string()
                ];

                dispatch_event('filter.customerCollection.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }
}
