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
                'Not equal' => [
                    'value' => "<>",
                ],
                'Less than' => [
                    'value' => "<"
                ],
                'Greater than' => [
                    'value' => ">"
                ],
                'Greater than or equal to' => [
                    'value' => ">="
                ],
                'Less than or equal to' => [
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