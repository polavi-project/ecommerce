<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Module\Install;


use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class ValidateMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            if(!file_exists(CONFIG_PATH . DS . 'config.php') and !file_exists(CONFIG_PATH . DS . 'config.tmp.php'))
                throw new \Exception("You need to install the app first");

            $module = $request->attributes->get("module");
            if(!preg_match('/^[A-Za-z0-9_]+$/', $module))
                throw new \Exception("Invalid module name");
            if(!file_exists(COMMUNITY_MODULE_PATH . DS . $module) && !file_exists(MODULE_PATH . DS . $module))
                throw new \Exception("Module folder could not be found");
            $conn = _mysql();
            if($conn->getTable("migration")->where("module", "LIKE", $module)->fetchOneAssoc())
                throw new \Exception(sprintf("Module %s is already installed", $module));

            return $delegate;
        } catch (\Exception $e) {
            $response->addData('success', 0);
            $response->addData('message', $e->getMessage());
            return $response;
        }
    }
}