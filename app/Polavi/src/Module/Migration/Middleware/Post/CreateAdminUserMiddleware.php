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


class CreateAdminUserMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        require_once CONFIG_PATH . DS . 'config.tmp.php';
        $conn = _mysql();
        $conn->startTransaction();
        try {
            $adminUserTable = $conn->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"admin_user\" LIMIT 0,1", ['dbName'=> $this->getContainer()->get(Configuration::class)->getDb()])->fetch(\PDO::FETCH_ASSOC);
            if($adminUserTable === false)
                $conn->executeQuery("CREATE TABLE `admin_user` (
                  `admin_user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
                  `status` smallint(5) unsigned NOT NULL,
                  `email` char(255) NOT NULL,
                  `password` char(255) NOT NULL,
                  `full_name` char(255) DEFAULT NULL,
                  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (`admin_user_id`),
                  UNIQUE KEY `EMAIL_UNIQUE` (`email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Admin user'");

            $user = [
                'full_name'=>$request->request->get('full_name'),
                'email'=>$request->request->get('email'),
                'status'=>1,
                'password'=>password_hash($request->request->get('password'), PASSWORD_DEFAULT)
            ];
            $conn->getTable('admin_user')->insert($user);

            $request->getSession()->set('user_id', $conn->getLastID());
            $conn->commit();
            $response->addData('success', 1);
        } catch (\Exception $e) {
            $conn->rollback();
            $response->addData('success', 0)->addData('message', $e->getMessage());
        }

        return $response->notNewPage();
    }
}