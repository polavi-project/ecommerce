<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Customer\Middleware\Register;


use function Similik\get_base_url;
use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getCustomer()->isLoggedIn() == true) {
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('homepage'));
            return $response;
        }

        $this->getContainer()->get(Helmet::class)->setTitle("Register for an account");

        $response->addWidget(
            'customer_registration_form',
            'content',
            10,
            get_js_file_url("production/customer/registration_form.js", false),
            [
                'action' => $this->getContainer()->get(Router::class)->generateUrl('customer.register.post'),
                'redirectUrl' => get_base_url(false)
            ]
        );

        return $delegate;
    }
}