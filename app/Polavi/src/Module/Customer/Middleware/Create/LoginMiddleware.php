<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Customer\Middleware\Create;


use GuzzleHttp\Promise\Promise;
use function Polavi\get_config;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\SendGrid\Services\SendGrid;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class LoginMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, Promise $promise = null)
    {
        if (!$promise instanceof Promise)
            return $promise;

        $promise->then(function ($result) {
            if (isset($result->data['createCustomer']['status']) and $result->data['createCustomer']['status'] == true) {
                if (isset($result->data['createCustomer']['status']) and $result->data['createCustomer']['status'] == true)
                    $this->getContainer()->get(Request::class)->getCustomer()->forceLogin($result->data['createCustomer']['customer']['email']);
            }
        });

        return $promise;
    }
}