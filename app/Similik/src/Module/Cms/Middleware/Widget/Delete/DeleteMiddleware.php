<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Widget\Delete;


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
            _mysql()->getTable('cms_widget')->where('cms_widget_id', '=', $id)->delete();
            $response->addAlert("cms_widget_id_delete_success", "success", "Widget deleted");
            $response->redirect(generate_url('widget.grid'));
        } catch (\Exception $e) {
            $response->addAlert("cms_widget_id_delete_error", "error", $e->getMessage())->notNewPage();
        }
    }
}