<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use function Similik\_mysql;
use function Similik\dispatch_event;
use Similik\Module\Catalog\Services\Type\FilterTool\AttributeFilterType;
use Similik\Module\Graphql\Services\FilterFieldType;
use Similik\Services\Di\Container;

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
                    'name' => $container->get(FilterFieldType::class)
                ];

                dispatch_event('filter.widgetCollectionFilter.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}