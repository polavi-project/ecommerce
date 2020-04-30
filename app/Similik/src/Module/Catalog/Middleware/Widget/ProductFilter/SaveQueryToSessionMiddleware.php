<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Widget\ProductFilter;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class SaveQueryToSessionMiddleware extends MiddlewareAbstract
{

    // We save the root query to session, so a widget like "Product filter" can use to initialize the filter options
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // This is for category page, we will do it for search page later
        $request->getSession()->set("productCollectionQuery", [
            "category" => [
                "operator" => "IN",
                "value" => $request->attributes->get("id")
            ]
        ]);

        return $delegate;
    }
}