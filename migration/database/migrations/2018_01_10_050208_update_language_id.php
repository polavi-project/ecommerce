<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateLanguageId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('product_description', function (Blueprint $table) {
            $table->smallInteger('language_id')->default(0)->change();
        });
        Schema::table('product_attribute_value_text', function (Blueprint $table) {
            $table->smallInteger('language_id')->default(0)->change();
        });
        Schema::table('category_description', function (Blueprint $table) {
            $table->smallInteger('language_id')->default(0)->change();
        });
        Schema::table('setting', function (Blueprint $table) {
            $table->smallInteger('language_id')->default(0)->change();
        });
        Schema::table('widget_instance_setting', function (Blueprint $table) {
            $table->smallInteger('language_id')->default(0)->change();
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
