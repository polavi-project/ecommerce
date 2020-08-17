<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Graphql\Services;


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Polavi\Services\Di\Container;

class KeyValuePairFieldType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'KeyValuePairFieldType',
            'fields' => function () use ($container) {
                $fields = [
                    'key' => Type::nonNull(Type::string()),
                    'value' => Type::string()
                ];

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}