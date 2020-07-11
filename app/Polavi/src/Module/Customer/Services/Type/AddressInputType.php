<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use function Polavi\dispatch_event;
use Polavi\Services\Di\Container;

class AddressInputType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'AddressInput',
            'fields' => function() use($container) {
                $fields = [
                    'full_name' => Type::nonNull(Type::string()),
                    'telephone' => Type::nonNull(Type::string()),
                    'address_1' => Type::string(),
                    'address_2' => Type::string(),
                    'postcode' => Type::string(),
                    'city' => Type::string(),
                    'province' => Type::string(),
                    'country' => Type::nonNull(Type::string()),
                    'is_default' => Type::int()
                ];
                dispatch_event('filter.customerAddress.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}