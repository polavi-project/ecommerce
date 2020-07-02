<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use function Polavi\_mysql;
use function Polavi\dispatch_event;
use Polavi\Module\Catalog\Services\Type\FilterTool\AttributeFilterType;
use Polavi\Module\Graphql\Services\FilterFieldType;
use Polavi\Services\Di\Container;

class WidgetCollectionFilterType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'widgetCollectionFilter',
            'fields' => function() use($container) {
                $fields = [
                    'status' => $container->get(FilterFieldType::class),
                    'type' => $container->get(FilterFieldType::class),
                    'name' => $container->get(FilterFieldType::class),
                    'limit' => $container->get(FilterFieldType::class),
                    'page' => $container->get(FilterFieldType::class),
                    'sortBy' => $container->get(FilterFieldType::class),
                    'sortOrder' => $container->get(FilterFieldType::class)
                ];

                dispatch_event('filter.widgetCollectionFilter.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}