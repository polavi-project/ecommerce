<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Module\Install;


use function Polavi\_mysql;
use function Polavi\generate_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Db\Processor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class InstallMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $conn = _mysql();
        $conn->startTransaction();
        try {
            $module = $request->attributes->get("module");
            $path = file_exists(MODULE_PATH . DS . $module) ? MODULE_PATH . DS . $module : COMMUNITY_MODULE_PATH . DS . $module;
            $this->getContainer()->set("moduleLoading", true);
            (function() use($path, $module, &$conn) {
                if (!file_exists($path . DS . "migration.php"))
                    throw new \Exception("migration.php file was not found");
                $migrations = require_once $path . DS . "migration.php";
                if (!isset($version) or !preg_match("/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/", $version))
                    throw new \Exception("Version variable is either not defined or invalid");

                if (is_array($migrations))
                    $this->runMigration($migrations, $conn);

                $conn->getTable("migration")->insert([
                    "module" => $module,
                    "version" => $version,
                    "status" => 1
                ]);
            })();
            $this->getContainer()->offsetUnset("moduleLoading");
            $response->addData('success', 1)->addData('message', 'Done');

            if ($request->getMethod() == "GET")
                $response->addAlert("module_install_success", "success", sprintf("Module %s is installed successfully", $module))
                    ->redirect(generate_url("extensions.grid"));

            $conn->commit();
            return $response;
        } catch (\Exception $e) {
            $conn->rollback();
            $this->getContainer()->offsetUnset("moduleLoading");
            $response->addData('success', 0);

            if ($request->getMethod() == "GET")
                $response->addAlert("module_install_error", "error", $e->getMessage())->notNewPage();
            return $response;
        }
    }

    protected function runMigration(array $migrations, Processor $conn)
    {
        // Each of element must have valid version number (example: 1.0.1)
        $migrations = array_filter($migrations, function($v, $k) {
            return preg_match("/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/", $k);
        }, ARRAY_FILTER_USE_BOTH);

        uksort($migrations, function($a, $b) {
            return version_compare($a, $b) >= 0;
        });

        foreach ($migrations as $v => $callback) {
            $callback($conn);
        }
    }
}