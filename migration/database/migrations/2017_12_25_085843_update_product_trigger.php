<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateProductTrigger extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
        DROP TRIGGER IF EXISTS `TRIGGER_PRODUCT_AFTER_UPDATE`;
        CREATE TRIGGER `TRIGGER_PRODUCT_AFTER_UPDATE` AFTER UPDATE ON `product` 
                    FOR EACH ROW
                    BEGIN
                        DELETE FROM `product_attribute_value`
                        WHERE `product_attribute_value`.`product_attribute_value_product_id` = New.product_id 
                        AND `product_attribute_value`.`product_attribute_value_attribute_id` NOT IN (SELECT `attribute_group_link`.`attribute_id` FROM `attribute_group_link` WHERE `attribute_group_link`.`group_id` = NEW.group_id);
        
                        DELETE FROM `product_attribute_value_text`
                        WHERE `product_attribute_value_text`.`product_attribute_value_text_product_id` = New.product_id 
                        AND `product_attribute_value_text`.`product_attribute_value_text_attribute_id` NOT IN (SELECT `attribute_group_link`.`attribute_id` FROM `attribute_group_link` WHERE `attribute_group_link`.`group_id` = NEW.group_id);
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
