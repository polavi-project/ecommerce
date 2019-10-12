<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTriggerAfterDeleteAttribute extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
DROP TRIGGER IF EXISTS `TRIGGER_AFTER_DELETE_ATTRIBUTE`;

CREATE
    /*!50017 DEFINER = \'root\'@\'localhost\' */
    TRIGGER `TRIGGER_AFTER_DELETE_ATTRIBUTE` AFTER DELETE ON `attribute` 
    FOR EACH ROW BEGIN
	            DELETE FROM `variant_group` WHERE `variant_group`.attr_one = OLD.attribute_id OR `variant_group`.`attr_two` = OLD.attribute_id OR `variant_group`.`attr_three` = OLD.attribute_id;
            END
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
