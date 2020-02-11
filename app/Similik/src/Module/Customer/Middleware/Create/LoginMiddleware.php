<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Create;


use GuzzleHttp\Promise\Promise;
use function Similik\get_config;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\SendGrid\Services\SendGrid;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class LoginMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, Promise $promise = null)
    {
        if(!$promise instanceof Promise)
            return $promise;

        $promise->then(function($result) {
            if(isset($result->data['createCustomer']['status']) and $result->data['createCustomer']['status'] == true) {
                if(isset($result->data['createCustomer']['status']) and $result->data['createCustomer']['status'] == true)
                    $this->getContainer()->get(Request::class)->getCustomer()->forceLogin($result->data['createCustomer']['customer']['email']);
            }
        });

        return $promise;
    }
}