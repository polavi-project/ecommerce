<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Update;


use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Schema;
use function Similik\buildInputQuery;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class UpdateAccountMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $data = $request->request->all();
        if(!$request->isAdmin())
            $data['customer_id'] = $request->getCustomer()->getData('customer_id');
        else
            $data['customer_id'] = $request->attributes->get('id');
        /**@var InputObjectType $customerInputType*/
        $customerInputType = $this->getContainer()->get(Schema::class)->getType('updateCustomerInput');
        $customer = buildInputQuery($customerInputType, $data);

        $promise = $this->getContainer()
            ->get(GraphqlExecutor::class)
            ->waitToExecute([
                "query"=>"mutation {
                        updateCustomer (
                            customer : $customer
                        ) 
                        {
                            status
                            message 
                            customer {
                                full_name
                                email
                            }
                        }
                        
                    }"
            ])
            ->then(function($result) use ($request, $response) {
                if($result->errors)
                    throw new \Exception($result->errors[0]->message);

                if($result->data['updateCustomer']['status'] == false)
                    throw new \Exception($result->data['updateCustomer']['message']);

                //->getSession()->getFlashBag()->add('success', 'Account updated');
                $response->addData('updateCustomer', $result->data['updateCustomer'])->notNewPage();
            })->otherwise(function(\Exception $reason) use($request, $response) {
                $response->addAlert('customer_update_error', 'error', $reason->getMessage())->notNewPage();
                throw $reason;
            });

        return $promise;
    }
}