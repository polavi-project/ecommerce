<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateAttributeValueIndexTable extends Migration
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
                        DELETE FROM `product_attribute_value_index`
                        WHERE `product_attribute_value_index`.`product_id` = New.product_id 
                        AND `product_attribute_value_index`.`attribute_id` NOT IN (SELECT `attribute_group_link`.`attribute_id` FROM `attribute_group_link` WHERE `attribute_group_link`.`group_id` = NEW.group_id);
            END;
'
        );
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
