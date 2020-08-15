<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Migration\Middleware\Post;


use function Polavi\_mysql;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Db\Configuration;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;


class CreateMigrationTableMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        $conn = _mysql();
        $conn->startTransaction();
        try {
            $migrationTable = $conn->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"migration\" LIMIT 0,1", ['dbName'=> $this->getContainer()->get(Configuration::class)->getDb()])->fetch(\PDO::FETCH_ASSOC);
            if ($migrationTable === false)
                $conn->executeQuery("CREATE TABLE `migration` (
                  `migration_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
                  `module` char(255) NOT NULL,
                  `version` char(255) NOT NULL,
                  `status` char(255) NOT NULL,
                  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (`migration_id`),
                  UNIQUE KEY `MODULE_UNIQUE` (`module`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Migration'");
            $conn->getTable('migration')->insert([
                "module" => "Migration",
                "version" => "1.0.0",
                "status" => 1
            ]);
            $conn->commit();
        } catch (\Exception $e) {
            $conn->rollback();
            $response->addData('success', 0);
            $response->addData('message', $e->getMessage());
            return $response;
        }

        return null;
    }
}