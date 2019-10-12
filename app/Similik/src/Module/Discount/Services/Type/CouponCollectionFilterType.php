<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use function Similik\dispatch_event;
use Similik\Module\Graphql\Services\FilterFieldType;
use Similik\Services\Di\Container;

class CouponCollectionFilterType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'CouponCollectionFilter',
            'fields' => function() use($container) {
                $fields = [
                    'id' => $container->get(FilterFieldType::class),
                    'status' => $container->get(FilterFieldType::class),
                    'price' => $container->get(FilterFieldType::class),
                    'stock' => $container->get(FilterFieldType::class),
                    'name' => $container->get(FilterFieldType::class),
                    'sku' => $container->get(FilterFieldType::class),
                    'category' => $container->get(FilterFieldType::class)
                ];

                dispatch_event('filter.couponCollectionFilter.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}