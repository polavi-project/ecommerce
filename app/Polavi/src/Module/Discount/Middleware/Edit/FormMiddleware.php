<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Middleware\Edit;

use function Polavi\create_mutable_var;
use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if ($request->attributes->get('_matched_route') == 'coupon.edit') {
            $this->getContainer()->get(Helmet::class)->setTitle("Edit coupon");
            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=> create_mutable_var("edit_coupon_query", "{
                        coupon (id: {$request->get('id')}) {
                            coupon_id
                            status
                            description
                            discount_amount
                            free_shipping
                            discount_type
                            coupon
                            used_time
                            target_products
                            condition
                            user_condition
                            buyx_gety
                            max_uses_time_per_coupon
                            max_uses_time_per_customer
                            start_date
                            end_date
                        }
                    }")
                ])
                ->then(function ($result) use ($request, $response) {
                    $advancedPrice = [];
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    if (isset($result->data['coupon'])) {
                        $response->addWidget(
                            'coupon_edit_form',
                            'content',
                            10,
                            get_js_file_url("production/discount/edit/coupon_form.js", true),
                            array_merge($result->data['coupon'],
                                [
                                    "action"=> $this->getContainer()->get(Router::class)->generateUrl("coupon.save", ['id'=>$request->attributes->get('id', null)]),
                                    "listUrl" => generate_url('coupon.grid'),
                                    "cancelUrl" => $request->attributes->get('id') ? generate_url('coupon.edit', ['id' => $request->attributes->get('id')]) : generate_url('coupon.create')
                                ]
                            )
                        );
                    }
                });
        } else {
            $this->getContainer()->get(Helmet::class)->setTitle("Create coupon");
            $response->addWidget(
                'coupon_edit_form',
                'content',
                10,
                get_js_file_url("production/discount/edit/coupon_form.js", true),
                [
                    "action"=> $this->getContainer()->get(Router::class)->generateUrl("coupon.save", ['id'=>$request->attributes->get('id', null)]),
                    "listUrl" => generate_url('coupon.grid'),
                    "cancelUrl" => $request->attributes->get('id') ? generate_url('coupon.edit', ['id' => $request->attributes->get('id')]) : generate_url('coupon.create')
                ]
            );
        }

        return $delegate;
    }
}
