<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Module\Enable;


use function Polavi\_mysql;
use function Polavi\generate_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class EnableMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $conn = _mysql();
        $conn->startTransaction();
        try {
            $module = $request->attributes->get("module");
            $conn->getTable("migration")->where("module", "=", $module)->update(["status" => 1]);
            $response->addAlert("module_enabled_success", "success", sprintf("Module %s is enabled", $module))
                ->redirect(generate_url("extensions.grid"));

            $conn->commit();
            return $response;
        } catch (\Exception $e) {
            $conn->rollback();
            $response->addAlert("module_enabled_error", "error", $e->getMessage())->notNewPage();
            return $response;
        }
    }
}