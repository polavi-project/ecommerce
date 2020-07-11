<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Graphql\Services;


use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;

class FilterFieldType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'FilterFieldType',
            'fields' => function() use($container) {
                $fields = [
                    'key' => Type::string(),
                    'operator' => Type::nonNull(Type::string()),
                    'value' => Type::nonNull(Type::string())
                ];

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}