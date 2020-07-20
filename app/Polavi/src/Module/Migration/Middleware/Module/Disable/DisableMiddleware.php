<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Module\Disable;


use function Polavi\_mysql;
use function Polavi\generate_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Db\Processor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class DisableMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $conn = _mysql();
        $conn->startTransaction();
        try {
            $module = $request->attributes->get("module");
            $conn->getTable("migration")->where("module", "=", $module)->update(["status" => 0]);
            $response->addAlert("module_disable_success", "success", sprintf("Module %s is disabled", $module))
                ->redirect(generate_url("extensions.grid"));

            $conn->commit();
            return $response;
        } catch (\Exception $e) {
            $conn->rollback();
            $response->addAlert("module_disable_error", "error", $e->getMessage())->notNewPage();
            return $response;
        }
    }
}