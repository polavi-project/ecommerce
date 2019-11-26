<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Graphql\Services;


use GraphQL\Type\Definition\EnumType;

class FilterOperatorType extends EnumType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'FilterOperator',
            'description' => 'Filter Operator type',
            'values' => [
                'Equal' => [
                    'value' => "="
                ],
                'NotEqual' => [
                    'value' => "<>",
                ],
                'LessThan' => [
                    'value' => "<"
                ],
                'GreaterThan' => [
                    'value' => ">"
                ],
                'GreaterThanOrEqualTo' => [
                    'value' => ">="
                ],
                'LessThanOrEqualTo' => [
                    'value' => "<="
                ],
                'LIKE' => [
                    'value' => "LIKE"
                ],
                'IN' => [
                    'value' => "IN"
                ],
                'BETWEEN' => [
                    'value' => "BETWEEN"
                ]
            ]
        ]);
    }
}