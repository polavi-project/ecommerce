<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Tax\Middleware\Edit;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

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
        $this->getContainer()->get(Helmet::class)->setTitle('Tax setting');
        return $delegate;
    }
}
