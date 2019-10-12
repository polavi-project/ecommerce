<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\SendGrid\Customer;


use GuzzleHttp\Promise\Promise;
use function Similik\get_config;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Graphql\Services\ExecutionPromise;
use Similik\Module\SendGrid\Services\SendGrid;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class SendWelcomeEmailMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, Promise $promise = null)
    {
        $this->getContainer()->get(ExecutionPromise::class)->then(function($result) {
            if(isset($result->data['createCustomer']['status']) and $result->data['createCustomer']['status'] == true) {
                $templateId = get_config('sendgrid_customer_welcome_email');
                $this->getContainer()->get(SendGrid::class)->sendEmail(
                    $result->data['createCustomer']['customer']['email'],
                    $templateId,
                    $result->data['createCustomer']['customer']
                );
            }
        });

        return $promise;
    }
}