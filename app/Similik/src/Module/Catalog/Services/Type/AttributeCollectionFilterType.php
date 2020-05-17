<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use function Similik\create_mutable_var;
use Similik\Module\Graphql\Services\FilterFieldType;
use Similik\Services\Di\Container;

class AttributeCollectionFilterType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'AttributeCollectionFilter',
            'fields' => function() use($container) {
                return create_mutable_var('attributeCollectionFilterFields', [
                    'id' => $container->get(FilterFieldType::class),
                    'attribute_code' => $container->get(FilterFieldType::class),
                    'attribute_name' => $container->get(FilterFieldType::class),
                    'type' => $container->get(FilterFieldType::class),
                    'is_required' => $container->get(FilterFieldType::class),
                    'display_on_frontend' => $container->get(FilterFieldType::class),
                    'is_filterable' => $container->get(FilterFieldType::class),
                    'limit' => $container->get(FilterFieldType::class),
                    'page' => $container->get(FilterFieldType::class),
                    'sortBy' => $container->get(FilterFieldType::class),
                    'sortOrder' => $container->get(FilterFieldType::class)
                ]);
            }
        ];
        parent::__construct($config);
    }
}