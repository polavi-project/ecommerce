<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Marketing\Middleware\Newsletter;


use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class SubscribeMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response)
    {
        $email = $request->request->get("email");
        try {
            if(!filter_var($email, FILTER_VALIDATE_EMAIL))
                throw new \Exception("Invalid email");
            // Look up for customer ID
            $conn = _mysql();
            $customer = $conn->getTable("customer")->loadByField("email", $email);
            if(!$customer)
                $conn->getTable("newsletter_subscriber")->insertOnUpdate(["email"=> $email, "status" => "subscribed"]);
            else
                $conn->getTable("newsletter_subscriber")->insertOnUpdate(["email"=> $email, "status" => "subscribed", "customer_id" => $customer["customer_id"]]);

            $response->addData("success", 1)->addAlert("newsletter_subscribe_success", "success", "Email subscribed")->notNewPage();
        } catch (\Exception $e) {
            $response->addData("success", 0)->addAlert("newsletter_subscribe_error", "error", $e->getMessage())->notNewPage();
        }
    }
}