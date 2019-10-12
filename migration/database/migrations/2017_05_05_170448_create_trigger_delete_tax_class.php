<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTriggerDeleteTaxClass extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
		DROP TRIGGER IF EXISTS `TRIGGER_AFTER_DELETE_TAX_CLASS`;
        CREATE TRIGGER `TRIGGER_AFTER_DELETE_TAX_CLASS` AFTER DELETE ON `tax_class` 
            FOR EACH ROW BEGIN
	            UPDATE `product` SET `product`.tax_class = 0 WHERE `product`.tax_class = OLD.tax_class_id;
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
