<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Cms\Services\Type;


use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use function Polavi\dispatch_event;
use Polavi\Module\Graphql\Services\KeyValuePairFieldTypeInput;
use Polavi\Services\Di\Container;

class WidgetInputType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'WidgetInput',
            'fields' => function() use($container) {
                $fields = [
                    'id' => Type::int(),
                    'type' => Type::nonNull(Type::string()),
                    'name' => Type::nonNull(Type::string()),
                    'status' => Type::nonNull(Type::int()),
                    'setting' => Type::listOf($container->get(KeyValuePairFieldTypeInput::class)),
                    'display_setting' => Type::listOf($container->get(KeyValuePairFieldTypeInput::class)),
                    'sort_order' => Type::string(),
                    'language_id' => Type::int()
                ];
                dispatch_event('filter.widgetInput.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}