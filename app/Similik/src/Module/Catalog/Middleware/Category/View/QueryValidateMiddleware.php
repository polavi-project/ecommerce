<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\View;

use GraphQL\Language\Parser;
use GraphQL\Language\Source;
use GraphQL\Type\Schema;
use GraphQL\Validator\DocumentValidator;
use function Similik\get_base_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class QueryValidateMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $filter = trim($request->query->get("p_query", ""));
        if($filter == "")
            return $delegate;

        $query = "{productCollection {$filter} {products {product_id}}}";
        try {
            $documentNode = Parser::parse(new Source(str_replace("<FILTER>", "(filter: { category : {operator: \"IN\" value: \"{$request->attributes->get('id')}\"}})", $query) ?: '', 'GraphQL'));
            $errors = DocumentValidator::validate($this->getContainer()->get(Schema::class), $documentNode);
            if(!empty($errors))
                throw new \Exception("Query is invalid. Need to use the root one");

            return $delegate;
        } catch (\Exception $e) {
            $response->redirect(get_base_url() . $request->getUri());
            return $response;
        }
    }
}