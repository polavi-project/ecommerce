<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTriggerUpdateCouponUsesTime extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
		DROP TRIGGER IF EXISTS `TRIGGER_UPDATE_COUPON_USED_TIME_AFTER_CREATE_ORDER`;
        CREATE TRIGGER `TRIGGER_UPDATE_COUPON_USED_TIME_AFTER_CREATE_ORDER` AFTER INSERT ON `order` 
            FOR EACH ROW BEGIN
	            UPDATE `promotion` SET `promotion`.used_time = `promotion`.used_time + 1 WHERE `promotion`.coupon = NEW.coupon;
	            IF(NEW.customer_id != NULL) THEN
                    INSERT INTO `customer_coupon_use` (customer_id, coupon, used_time) VALUES (NEW.customer_id, NEW.coupon, 1)
                    WHERE `customer_coupon_use`.coupon = NEW.coupon 
                    ON DUPLICATE KEY UPDATE `customer_coupon_use`.used_time = `customer_coupon_use`.used_time + 1;
                ELSE
                    INSERT INTO `customer_coupon_use` (email, coupon, used_time) VALUES (NEW.customer_email, NEW.coupon, 1)
                    WHERE `customer_coupon_use`.coupon = NEW.coupon 
                    ON DUPLICATE KEY UPDATE `customer_coupon_use`.used_time = `customer_coupon_use`.used_time + 1;
                END IF;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
