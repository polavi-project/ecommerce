<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Order\Services\Type;


use GraphQL\Error\Error;
use GraphQL\Error\InvariantViolation;
use GraphQL\Language\AST\Node;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Utils\Utils;

class Date extends ScalarType
{
    public $name = "Date";

    public function serialize($value)
    {
        return $value;
    }

    public function parseValue($value)
    {
        $d = \DateTime::createFromFormat('Y-m-d', $value);
        if($d && $d->format('Y-m-d') === $value)
            return $value;
        else
            throw new InvariantViolation("Could not serialize following value as date: " . Utils::printSafe($value));
    }

    /**
     * Parses an externally provided literal value (hardcoded in GraphQL query) to use as an input.

     *
     * @param Node $valueNode
     * @param array|null $variables
     * @return string
     * @throws Error
     */
    public function parseLiteral($valueNode, ?array $variables = null)
    {
        if (!$valueNode instanceof StringValueNode) {
            throw new Error('Query error: Can only parse strings got: ' . $valueNode->kind, [$valueNode]);
        }
        $d = \DateTime::createFromFormat('Y-m-d', $valueNode->value);
        if($d && $d->format('Y-m-d') === $valueNode->value)
            return $valueNode->value;
        else
            throw new Error("Not a valid price", [$valueNode]);
    }
}