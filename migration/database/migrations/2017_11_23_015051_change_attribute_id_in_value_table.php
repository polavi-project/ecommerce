<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeAttributeIdInValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_attribute_value_text', function (Blueprint $table) {
            $table->renameColumn('attribute_id', 'product_attribute_value_text_attribute_id');
        });
        Schema::table('product_attribute_value', function (Blueprint $table) {
            $table->renameColumn('attribute_id', 'product_attribute_value_attribute_id');
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
