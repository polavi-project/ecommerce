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
use Polavi\Services\Di\Container;

class CmsPageInputType extends InputObjectType
{
    public function __construct(Container $container)
    {
        $config = [
            'name'=> 'CmsPageInput',
            'fields' => function () use ($container) {
                $fields = [
                    'id' => Type::int(),
                    'name' => Type::nonNull(Type::string()),
                    'status' => Type::nonNull(Type::int()),
                    'content' => Type::string(),
                    'layout' => Type::nonNull(Type::string()),
                    'url_key' => Type::string(),
                    'meta_keywords' => Type::string(),
                    'meta_title' => Type::string(),
                    'meta_description' => Type::string()
                ];
                dispatch_event('filter.cmsPageInput.input', [&$fields]);

                return $fields;
            }
        ];
        parent::__construct($config);
    }
}