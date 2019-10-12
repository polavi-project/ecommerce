<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TriggerAfterUnassignAttributeFromGroup extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
            DROP TRIGGER IF EXISTS `TRIGGER_REMOVE_ATTRIBUTE_FROM_GROUP`;
            
            CREATE TRIGGER `TRIGGER_REMOVE_ATTRIBUTE_FROM_GROUP` AFTER DELETE ON `attribute_group_link` 
            FOR EACH ROW BEGIN
                DELETE FROM `product_attribute_value` WHERE product_attribute_value.attribute_id = OLD.attribute_id AND product_attribute_value.product_id IN (SELECT product.product_id from product WHERE product.group_id = OLD.group_id);
                DELETE FROM `product_attribute_value_text` WHERE product_attribute_value_text.attribute_id = OLD.attribute_id AND product_attribute_value_text.product_id IN (SELECT product.product_id from product WHERE product.group_id = OLD.group_id);
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
