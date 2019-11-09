<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Install\Middleware\Form;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class FormMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response)
    {
        $response->addWidget(
            'installation_form',
            'content',
            0,
            get_js_file_url("production/install/form/installation_form.js", true)
        );
    }
}