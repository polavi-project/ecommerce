<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;

use Doctrine\DBAL\Connection;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use function Similik\_mysql;
use function Similik\dispatch_event;
use function Similik\get_base_url;
use function Similik\get_base_url_scheme_less;
use Similik\Services\Di\Container;
use Similik\Module\Catalog\Services\DataLoader;
use Similik\Services\Db\Processor;
use Similik\Services\Db\Table;
use GraphQL\Type\Definition\Type;
use Similik\Services\Http\Request;
use Similik\Services\Routing\Router;
use function Similik\str_replace_last;
use Symfony\Component\Filesystem\Filesystem;

class ProductTierPriceType extends ObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name' => 'ProductTierPrice',
            'fields' => function() use ($container){
                $fields = [
                    'product_id' => [
                        'type' => Type::nonNull(Type::id()),
                        'resolve' => function($value, $args, Container $container, ResolveInfo $info) {
                            return isset($value['product_price_product_id']) ? $value['product_price_product_id'] : null;
                        }
                    ],
                    'customer_group_id' => [
                        'type' => Type::nonNull(Type::string())
                    ],
                    'price' => [
                        'type' => Type::nonNull(Type::float())
                    ],
                    'qty' => [
                        'type' => Type::nonNull(Type::int())
                    ],
                    'active_from' => [
                        'type' => Type::string()
                    ],
                    'active_to' => [
                        'type' => Type::string()
                    ]
                ];

                dispatch_event('filter.productTierPrice.type', [&$fields]);

                return $fields;
            },
            'resolveField' => function($value, $args, Container $container, ResolveInfo $info) {
                return isset($value[$info->fieldName]) ? $value[$info->fieldName] : null;
            }
        ];

        parent::__construct($config);
    }

}
