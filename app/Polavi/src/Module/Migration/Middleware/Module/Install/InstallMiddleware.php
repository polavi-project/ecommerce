<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Module\Install;


use function PHPSTORM_META\elementType;
use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class InstallMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $module = $request->attributes->get("module");
            $path = file_exists(MODULE_PATH . DS . $module) ? MODULE_PATH . DS . $module : COMMUNITY_MODULE_PATH . DS . $module;
            if(!preg_match('/^[A-Za-z0-9_]+$/', $module))
                throw new \Exception("Invalid module name");
            include $path . DS . $module . DS . "migration.php";

            $conn = _mysql();
            $conn->getTable("migration")->insert([
                "module" => $module,
                "version" => $
            ]);

            return $delegate;
        } catch (\Exception $e) {
            $response->addData('success', 0);
            $response->addData('message', $e->getMessage());
            return $response;
        }
    }
}