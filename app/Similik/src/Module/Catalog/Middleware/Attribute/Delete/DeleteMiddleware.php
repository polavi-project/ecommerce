<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Delete;


use function Similik\_mysql;
use function Similik\generate_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class DeleteMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $id = $request->attributes->get('id');
        try {
            _mysql()->getTable('attribute')->where('attribute_id', '=', $id)->delete();
            $response->addAlert("attribute_delete_success", "success", "Attribute deleted");
            $response->redirect(generate_url('attribute.grid'));
        } catch (\Exception $e) {
            $response->addAlert("attribute_delete_error", "error", $e->getMessage())->notNewPage();
        }
    }
}