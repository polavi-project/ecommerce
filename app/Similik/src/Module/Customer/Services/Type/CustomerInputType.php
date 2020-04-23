<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use function Similik\dispatch_event;
use Similik\Services\Di\Container;

class CustomerInputType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'CustomerInput',
            'fields' => function() use($container) {
                $fields = [
                    'customer_id' => Type::int(),
                    'full_name' => Type::nonNull(Type::string()),
                    'email' => Type::nonNull(Type::string()),
                    'status' => Type::int(),
                    'group_id' => Type::int(),
                    'password' => Type::string()
                ];
                dispatch_event('filter.customer.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}