<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RefactorAttributeValueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_attribute_value_index', function (Blueprint $table) {
            $table->increments('product_attribute_value_index_id');
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('attribute_id');
            $table->unsignedInteger('option_id')->nullable();
            $table->unsignedInteger('attribute_value')->nullable();;
            $table->unsignedInteger('language_id')->nullable();
        });

        Schema::table('product_attribute_value_index', function (Blueprint $table) {
            $table->foreign('product_id', 'FK_PRODUCT_ATTRIBUTE_LINK')
                ->references('product_id')->on('product')
                ->onDelete('cascade');
        });

        Schema::table('product_attribute_value_index', function (Blueprint $table) {
            $table->foreign('attribute_id', 'FK_ATTRIBUTE_VALUE_LINK')
                ->references('attribute_id')->on('attribute')
                ->onDelete('cascade');
        });

        Schema::table('product_attribute_value_index', function (Blueprint $table) {
            $table->foreign('option_id', 'FK_ATTRIBUTE_OPTION_VALUE_LINK')
                ->references('attribute_option_id')->on('attribute_option')
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
