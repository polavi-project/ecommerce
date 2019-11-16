<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Tax\Middleware\Migrate\Install;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\RedirectResponse;

class InstallMiddleware extends MiddlewareAbstract
{
    /**@var Processor $processor*/
    protected $processor;

    public function __invoke(Request $request, Response $response)
    {
        if(!file_exists(CONFIG_PATH . DS . 'config.tmp.php')) {
            $redirect = new RedirectResponse($this->getContainer()->get(Router::class)->generateUrl('homepage'));
            return $redirect->send();
        }
        require_once CONFIG_PATH . DS . 'config.tmp.php';
        $this->processor = new Processor();
        $taxClassTable = $this->processor->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"tax_class\" LIMIT 0,1", ['dbName'=> DB_DATABASE])->fetch(\PDO::FETCH_ASSOC);
        if($taxClassTable !== false) {
            $response->addData('success', 0)->addData('message', 'Installed');
            return $response;
        }

        $this->processor->startTransaction();
        try {
            //Create tax_class table
            $this->processor->executeQuery("CREATE TABLE `tax_class` (
              `tax_class_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `name` char(255) NOT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`tax_class_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tax class'");

            //Create tax_rate table
            $this->processor->executeQuery("CREATE TABLE `tax_rate` (
              `tax_rate_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `name` char(255) NOT NULL,
              `tax_class_id` int(10) unsigned NOT NULL,
              `country` char(5) NOT NULL DEFAULT '*',
              `province` char(5) NOT NULL DEFAULT '*',
              `postcode` char(255) NOT NULL DEFAULT '*',
              `rate` decimal(12,4) NOT NULL,
              `is_compound` smallint(5) unsigned NOT NULL DEFAULT '0',
              `priority` smallint(5) unsigned NOT NULL DEFAULT '0',
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`tax_rate_id`),
              KEY `FK_TAX_CLASS` (`tax_class_id`),
              CONSTRAINT `FK_TAX_CLASS` FOREIGN KEY (`tax_class_id`) REFERENCES `tax_class` (`tax_class_id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tax rate'");

            $this->processor->commit();
            $response->addData('success', 1)->addData('message', 'Done');
        } catch (\Exception $e) {
            $this->processor->rollback();
            $response->addData('success', 0)->addData('message', $e->getMessage());
        }

        return $response;
    }
}