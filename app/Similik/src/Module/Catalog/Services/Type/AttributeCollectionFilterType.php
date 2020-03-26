<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use function Similik\_mysql;
use function Similik\create_mutable_var;
use function Similik\dispatch_event;
use Similik\Module\Catalog\Services\Type\FilterTool\AttributeFilterType;
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
                ]);
            }
        ];
        parent::__construct($config);
    }
}