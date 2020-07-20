<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Module\Grid;

use function Polavi\_mysql;
use function Polavi\generate_url;
use function Polavi\get_js_file_url;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;

class GridMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($response->hasWidget('extension-grid'))
            return $delegate;

        $this->getContainer()->get(Helmet::class)->setTitle("Extensions");
        $directories = array_diff(scandir(COMMUNITY_MODULE_PATH), ['..', '.']);

        $extensions = [];
        foreach ($directories as $directory) {
            if(!is_dir(COMMUNITY_MODULE_PATH . DS . $directory))
                continue;
            if(!file_exists(COMMUNITY_MODULE_PATH . DS . $directory . DS . "migration.php"))
                continue;
            $v = $des = $aut = $autUrl = null;
            (function() use (&$v, &$des, &$aut, &$autUrl, $directory) {
                include COMMUNITY_MODULE_PATH . DS . $directory . DS . "migration.php";
                $v = $version ?? null;
                $des = $description ?? null;
                $aut = $author ?? null;
                $autUrl = $authorUrl ?? null;
            })();

            $extensions[] = [
                "name" => $directory,
                "version" => $v,
                "description" => $des,
                "author" => $aut,
                "author_url" => $autUrl,
                "disableUrl" => generate_url("migration.module.disable", ["module" => $directory]),
                "enableUrl" => generate_url("migration.module.enable", ["module" => $directory]),
                "installUrl" => generate_url("migration.module.install", ["module" => $directory])
            ];
        }

        $conn = _mysql();
        array_walk($extensions, function(&$e) use($conn) {
            $ext = $conn->getTable("migration")->loadByField("module", $e["name"]);
            if(!$ext)
                $e["status"] = null;
            else
                $e["status"] = (int) $ext["status"];
        });

        $response->addWidget(
            'extension_grid',
            'content',
            20,
            get_js_file_url("production/migration/module/grid.js", true),
            [
                "extensions" => $extensions
            ]
        );

        return $delegate;
    }
}