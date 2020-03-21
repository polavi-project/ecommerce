<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\AttributeGroup\Delete;


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
            _mysql()->getTable('attribute_group')->where('attribute_group_id', '=', $id)->delete();
            $response->addAlert("attribute_group_delete_success", "success", "Attribute group deleted");
            $response->redirect(generate_url('attribute.group.grid'));
        } catch (\Exception $e) {
            $response->addAlert("attribute_group_delete_error", "error", $e->getMessage())->notNewPage();
        }

        return $delegate;
    }
}