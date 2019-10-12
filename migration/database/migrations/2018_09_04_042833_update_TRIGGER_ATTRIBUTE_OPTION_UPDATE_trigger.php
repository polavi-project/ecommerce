<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTRIGGERATTRIBUTEOPTIONUPDATETrigger extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
    DROP TRIGGER IF EXISTS `TRIGGER_ATTRIBUTE_OPTION_UPDATE`;
        CREATE
    TRIGGER `TRIGGER_ATTRIBUTE_OPTION_UPDATE` AFTER UPDATE ON `attribute_option` 
    FOR EACH ROW UPDATE `product_attribute_value` SET `product_attribute_value`.`attribute_text` = NEW.option_text

WHERE `product_attribute_value`.`attribute_value` = NEW.attribute_option_id AND `product_attribute_value`.`product_attribute_value_attribute_id` = NEW.attribute_id;
            END;'
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
