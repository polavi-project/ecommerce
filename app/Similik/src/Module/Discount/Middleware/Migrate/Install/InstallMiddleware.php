<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Discount\Middleware\Migrate\Install;


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
        $couponTable = $this->processor->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"coupon\" LIMIT 0,1", ['dbName'=> DB_DATABASE])->fetch(\PDO::FETCH_ASSOC);
        if($couponTable !== false) {
            $response->addData('success', 0)->addData('message', 'Installed');
            return $response;
        }

        $this->processor->startTransaction();
        try {
            //Create coupon table
            $this->processor->executeQuery("CREATE TABLE `coupon` (
              `coupon_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `status` smallint(6) NOT NULL DEFAULT '1',
              `description` char(255) NOT NULL,
              `discount_amount` decimal(12,4) NOT NULL,
              `free_shipping` smallint(5) unsigned NOT NULL DEFAULT '0',
              `discount_type` varchar(255) NOT NULL DEFAULT '1',
              `coupon` char(255) NOT NULL,
              `used_time` int(10) unsigned NOT NULL DEFAULT '0',
              `target_products` char(255) DEFAULT NULL,
              `condition` char(255) NOT NULL,
              `user_condition` char(255) DEFAULT NULL,
              `buyx_gety` char(255) DEFAULT NULL,
              `max_uses_time_per_coupon` int(10) unsigned DEFAULT NULL,
              `max_uses_time_per_customer` int(10) unsigned DEFAULT NULL,
              `start_date` datetime DEFAULT NULL,
              `end_date` datetime DEFAULT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`coupon_id`),
              UNIQUE KEY `promotion_coupon_unique` (`coupon`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Coupon'");

            //Create customer_coupon_use table
            $this->processor->executeQuery("CREATE TABLE `customer_coupon_use` (
              `customer_coupon_use_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `customer_id` int(10) unsigned DEFAULT NULL,
              `coupon` char(255) NOT NULL,
              `used_time` int(10) unsigned NOT NULL,
              PRIMARY KEY (`customer_coupon_use_id`),
              UNIQUE KEY `CUSTOMER_COUPON_UNIQUE` (`customer_id`,`coupon`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Customer coupon use count'");

            //Create TRIGGER_UPDATE_COUPON_USED_TIME_AFTER_CREATE_ORDER trigger
            $this->processor->executeQuery(
                "CREATE TRIGGER `TRIGGER_UPDATE_COUPON_USED_TIME_AFTER_CREATE_ORDER` AFTER INSERT ON `order` 
                    FOR EACH ROW                     
                        BEGIN
                            UPDATE `coupon` SET `coupon`.used_time = `coupon`.used_time + 1 WHERE `coupon`.coupon = NEW.coupon;
                            IF (NEW.customer_id <> NULL) THEN
                                INSERT INTO `customer_coupon_use` (`customer_id`, `coupon`, `used_time`) VALUES (NEW.customer_id, NEW.coupon, 1)
                                    ON DUPLICATE KEY UPDATE `customer_coupon_use`.used_time = `customer_coupon_use`.used_time + 1;
                            END IF;
                        END;"
            );

            $this->processor->commit();
            $response->addData('success', 1)->addData('message', 'Done');
        } catch (\Exception $e) {
            $this->processor->rollback();
            $response->addData('success', 0)->addData('message', $e->getMessage());
        }

        return $response;
    }
}