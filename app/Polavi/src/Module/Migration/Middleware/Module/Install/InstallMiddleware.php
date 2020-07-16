<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Module\Install;


use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Di\Container;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use function Polavi\the_container;

class InstallMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $module = $request->attributes->get("module");
            $path = file_exists(MODULE_PATH . DS . $module) ? MODULE_PATH . DS . $module : COMMUNITY_MODULE_PATH . DS . $module;
            if(!preg_match('/^[A-Za-z0-9_]+$/', $module))
                throw new \Exception("Invalid module name");
            $conn = _mysql();
            the_container(new Container());
            (function() use($path, $module, &$conn) {
                if(!file_exists($path . DS . "migration.php"))
                    throw new \Exception("migration.php file was not found");
                $migrations = require_once $path . DS . "migration.php" ?? [];
                if(!isset($version))
                    throw new \Exception("Version variable must be defined");

                foreach ($migrations as $migrateCallback) {
                    if(!is_callable($migrateCallback))
                        throw new \Exception("Invalid migrate function");
                    $migrateCallback();
                }

                $conn->getTable("migration")->insert([
                    "module" => $module,
                    "version" => $version,
                    "status" => 1
                ]);
            })();
            the_container()
            $response->addData('success', 1)->addData('message', 'Done');
            return $delegate;
        } catch (\Exception $e) {
            $response->addData('success', 0);
            $response->addData('message', $e->getMessage());
            return $response;
        }
    }
}