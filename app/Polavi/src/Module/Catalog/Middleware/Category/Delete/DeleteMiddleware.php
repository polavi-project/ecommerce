<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Category\Delete;


use function Polavi\_mysql;
use function Polavi\generate_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class DeleteMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $id = $request->attributes->get('id');
        try {
            _mysql()->getTable('category')->where('category_id', '=', $id)->delete();
            $response->addAlert("category_delete_success", "success", "Category deleted");
            $response->redirect(generate_url('category.grid'));
        } catch (\Exception $e) {
            $response->addAlert("category_delete_error", "error", $e->getMessage())->notNewPage();
        }

        return $delegate;
    }
}