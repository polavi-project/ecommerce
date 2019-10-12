<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTriggerAfterDeleteAttributeOption extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
		DROP TRIGGER IF EXISTS `TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION`;
        CREATE TRIGGER `TRIGGER_AFTER_DELETE_ATTRIBUTE_OPTION` AFTER DELETE ON `attribute_option` 
            FOR EACH ROW BEGIN
	            DELETE FROM `product_attribute_value` WHERE `product_attribute_value`.attribute_value = OLD.attribute_option_id AND `product_attribute_value`.`attribute_id` = OLD.attribute_id;
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
