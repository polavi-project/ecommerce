<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\View;

use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;


class GeneralInfoMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->getStatusCode() == 404)
            return $delegate;

        if($response->hasWidget('product_view_general_info'))
            return $delegate;

        $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"{
                    product_view_general_info: product(id: {$request->attributes->get('id')})
                    {
                        name
                        price
                        short_description
                        sku
                        stock_availability
                    }
                }"
            ])
            ->then(function($result) use ($response) {
                /**@var \GraphQL\Executor\ExecutionResult $result */
                if(isset($result->data['product_view_general_info']) and $result->data['product_view_general_info']) {
                    $response->addWidget(
                        'product_view_general',
                        'product_page_middle_right',
                        10,
                        get_js_file_url("production/catalog/product/view/general_info.js", false),
                        $result->data['product_view_general_info']
                    );

                    $this->getContainer()->get(Helmet::class)->setTitle($result->data['product_view_general_info']['name'])->addMeta([
                        'name'=> 'description',
                        'content' => $result->data['product_view_general_info']['short_description']
                    ]);
                }
            });

        return $delegate;
    }
}