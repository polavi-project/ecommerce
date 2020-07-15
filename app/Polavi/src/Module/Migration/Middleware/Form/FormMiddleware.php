<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Form;


use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class FormMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response)
    {
        $this->getContainer()->get(Helmet::class)->setTitle('Polavi installation');
        $response->addWidget(
            'installation_form',
            'content',
            0,
            get_js_file_url("production/install/form/installation_form.js", true),
            [
                'action'=>generate_url('migration.install.post')
            ]
        );
    }
}