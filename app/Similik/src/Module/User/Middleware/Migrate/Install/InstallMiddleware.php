<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\User\Middleware\Migrate\Install;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class InstallMiddleware extends MiddlewareAbstract
{
    /**@var Processor $processor*/
    protected $processor;

    public function __invoke(Request $request, Response $response)
    {
        $this->processor = new Processor();
        $adminUserTable = $this->processor->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"admin_user\" LIMIT 0,1", ['dbName'=> DB_DATABASE])->fetch(\PDO::FETCH_ASSOC);
        if($adminUserTable !== false) {
            $response->addData('success', 0)->addData('message', 'Installed');
            return $response;
        }

        $this->processor->startTransaction();
        try {
            //Create admin_user table
            $this->processor->executeQuery("DROP TABLE IF EXISTS `admin_user`");
            $this->processor->executeQuery("CREATE TABLE `admin_user` (
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
                'password'=>password_hash($request->request->get('password'), PASSWORD_DEFAULT)
            ];
            $this->processor->getTable('admin_user')->insert($user);

            $this->processor->commit();
            $response->addData('success', 1)->addData('message', 'Done');
        } catch (\Exception $e) {
            $this->processor->rollback();
            $response->addData('success', 0)->addData('message', $e->getMessage());
        }

        return $response;
    }
}