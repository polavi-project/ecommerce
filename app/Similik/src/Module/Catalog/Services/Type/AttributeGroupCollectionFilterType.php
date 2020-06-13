<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use function Similik\dispatch_event;
use Similik\Module\Graphql\Services\FilterFieldType;
use Similik\Services\Di\Container;

class AttributeGroupCollectionFilterType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'AttributeGroupCollectionFilter',
            'fields' => function() use($container) {
                $fields = [
                    'id' => $container->get(FilterFieldType::class),
                    'group_name' => $container->get(FilterFieldType::class),
                    'limit' => $container->get(FilterFieldType::class),
                    'page' => $container->get(FilterFieldType::class),
                    'sortBy' => $container->get(FilterFieldType::class),
                    'sortOrder' => $container->get(FilterFieldType::class)
                ];

                dispatch_event('filter.attributeGroupCollectionFilter.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}