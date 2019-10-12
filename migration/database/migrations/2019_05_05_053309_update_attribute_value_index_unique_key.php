<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateAttributeValueIndexUniqueKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::table('product_attribute_value_index', function (Blueprint $table) {
            $table->dropUnique('UNIQUE_OPTION_VALUE');
        });

        Schema::table('product_attribute_value_index', function (Blueprint $table) {
            $table->unique(['product_id', 'attribute_id', 'option_id'], 'UNIQUE_OPTION_VALUE');
        });
        Schema::table('product_attribute_value_index', function (Blueprint $table) {
            $table->unique(['product_id', 'attribute_id', 'language_id'], 'UNIQUE_TEXT_VALUE');
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
