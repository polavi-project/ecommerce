<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\Edit;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class CategoryMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($response->hasWidget('product_edit_category'))
            return $delegate;

        if ($request->attributes->get('_matched_route') == 'product.edit')
            $query = <<< QUERY
                    {
                        assignedCategories: product (id: {$request->get('id', 0)}) {
                            categories {
                                category_id
                            }
                        }
                        categoryCollection {
                            categories {
                                text: name
                                value: category_id
                            }
                        }
                    }
QUERY;
        else
            $query = <<< QUERY
                    {
                        categoryCollection {
                            categories {
                                text: name
                                value: category_id
                            }
                        }
                    }
QUERY;
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=> $query
            ])
            ->then(function ($result) use ($response) {
                $assignedCategories = [];
                $categories = [];
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if (isset($result->data['assignedCategories']['categories'])) {
                    foreach ($result->data['assignedCategories']['categories'] as $cat)
                        $assignedCategories[] = $cat['category_id'];
                }
                if (isset($result->data['categoryCollection']['categories'])) {
                    $categories = $result->data['categoryCollection']['categories'];
                }

                $response->addWidget(
                    'product_edit_category',
                    'product-edit-general',
                    41,
                    get_js_file_url("production/form/fields/multiselect.js", true),
                    ["id"=> "categories", "formId"=> "product-edit-form", "name"=> "categories[]", "label"=> "Category", "options"=>$categories, "value"=>$assignedCategories]
                );
            });

        return $delegate;
    }
}
