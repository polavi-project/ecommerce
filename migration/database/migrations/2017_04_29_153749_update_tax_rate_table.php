<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateTaxRateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tax_rate', function (Blueprint $table) {
            $table->unsignedInteger('tax_class_id')->after('tax_rate_id');
        });
        Schema::table('tax_rate', function (Blueprint $table) {
            $table->foreign('tax_class_id', 'FK_TAX_CLASS')
                ->references('tax_class_id')->on('tax_class')
                ->onDelete('cascade');
        });
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
