<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Order\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use function Polavi\dispatch_event;
use Polavi\Module\Graphql\Services\FilterFieldType;
use Polavi\Services\Di\Container;

class OrderCollectionFilterType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'OrderCollectionFilter',
            'fields' => function () use ($container) {
                $fields = [
                    'id' => $container->get(FilterFieldType::class),
                    'order_number' => $container->get(FilterFieldType::class),
                    'grand_total' => $container->get(FilterFieldType::class),
                    'payment_status' => $container->get(FilterFieldType::class),
                    'shipment_status' => $container->get(FilterFieldType::class),
                    'customer_email' => $container->get(FilterFieldType::class),
                    'created_at' => $container->get(FilterFieldType::class),
                    'limit' => $container->get(FilterFieldType::class),
                    'page' => $container->get(FilterFieldType::class),
                    'sortBy' => $container->get(FilterFieldType::class),
                    'sortOrder' => $container->get(FilterFieldType::class)
                ];

                dispatch_event('filter.orderCollectionFilter.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}