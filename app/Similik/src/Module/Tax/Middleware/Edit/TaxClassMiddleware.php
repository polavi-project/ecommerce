<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Tax\Middleware\Edit;

use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class TaxClassMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        // Loading data by using GraphQL
        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    taxClasses {
                        tax_class_id
                        name
                        rates {
                            id:tax_rate_id
                            name
                            country
                            province
                            postcode
                            rate
                            is_compound
                            priority
                        }
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['taxClasses'])) {
                    array_walk($result->data['taxClasses'], function(&$tax) {
                        $tax = array_merge($tax, [
                            'formId'=> 'tax_class_edit_' . $tax['tax_class_id']
                        ]);
                    });
                    $response->addWidget(
                        'tax_setting',
                        'content',
                        10,
                        get_js_file_url("production/tax/form.js", true),
                        [
                            'classes' => $result->data['taxClasses'],
                            'saveAction'=> $this->getContainer()->get(Router::class)->generateUrl('tax.class.save')
                        ]
                    );
                }
            });

        return $delegate;
    }
}
