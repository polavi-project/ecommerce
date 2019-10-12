<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Edit;

use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class CategoryMiddleware extends MiddlewareAbstract
{
    const FORM_ID = 'product-edit-form';
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('product_edit_category'))
            return $delegate;

        if($request->attributes->get('_matched_route') == 'product.edit')
            $query = <<< QUERY
                    {
                        assignedCategories: product (id: {$request->get('id', 0)} language:{$request->get('language', get_default_language_Id())}) {
                            categories {
                                category_id
                            }
                        }
                        categories {
                            text: name
                            value: category_id
                        }
                    }
QUERY;
        else
            $query = <<< QUERY
                    {
                        categories {
                            text: name
                            value: category_id
                        }
                    }
QUERY;
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> $query
            ])
            ->then(function($result) use ($response) {
                $assignedCategories = [];
                $categories = [];
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['assignedCategories']['categories'])) {
                    foreach($result->data['assignedCategories']['categories'] as $cat)
                        $assignedCategories[] = $cat['category_id'];
                }
                if (isset($result->data['categories'])) {
                    $categories = $result->data['categories'];
                }

                $response->addWidget(
                    'product_edit_category',
                    'product-edit-general',
                    31,
                    get_js_file_url("production/form/fields/multiselect.js", true),
                    ["id"=> "categories", 'formId'=> self::FORM_ID, "name"=> "categories[]", "label"=> "Category", "options"=>$categories, "value"=>$assignedCategories]
                );
            });

        return $delegate;
    }
}
