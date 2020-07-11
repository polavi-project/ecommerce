<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services\Type;


use Exception;
use GraphQL\Error\Error;
use GraphQL\Language\AST\Node;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ScalarType;
use function Polavi\get_config;
use function Polavi\get_default_language_code;

class Price extends ScalarType
{
    public $name = "Price";

    public function serialize($value)
    {
        return $value;
    }

    public function parseValue($value)
    {
        $formatter = new \NumberFormatter(get_default_language_code(), \NumberFormatter::CURRENCY);

        return $formatter->parseCurrency($value, get_config('general_currency', 'USD'));
    }

    /**
     * Parses an externally provided literal value (hardcoded in GraphQL query) to use as an input.

     *
     * @param \GraphQL\Language\AST\Node $valueNode
     * @param array|null $variables
     * @return string
     * @throws Error
     */
    public function parseLiteral($valueNode, ?array $variables = null)
    {
        if (!$valueNode instanceof StringValueNode) {
            throw new Error('Query error: Can only parse strings got: ' . $valueNode->kind, [$valueNode]);
        }
        if (!filter_var($valueNode->value, FILTER_VALIDATE_FLOAT)) {
            throw new Error("Not a valid price", [$valueNode]);
        }
        return $valueNode->value;
    }

}