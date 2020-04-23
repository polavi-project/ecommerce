<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Services;


use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class KeyValuePairFieldTypeInput extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'KeyValuePairFieldTypeInput',
            'fields' => function() use($container) {
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