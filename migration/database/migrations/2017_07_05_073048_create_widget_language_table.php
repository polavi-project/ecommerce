<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWidgetLanguageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('widget_instance_setting');
        Schema::create('widget_instance_setting', function (Blueprint $table) {
            $table->increments('widget_instance_setting_id');
            $table->unsignedInteger('widget_instance_id');
            $table->unsignedInteger('language_id');
            $table->text('setting');
        });

        Schema::table('widget_instance_setting', function (Blueprint $table) {
            $table->unique(['widget_instance_id', 'language_id'], 'WIDGET_INSTANCE_LANGUAGE_UNIQUE');
        });

        Schema::table('widget_instance', function (Blueprint $table) {
            $table->dropColumn('language_id');
            $table->dropColumn('setting');
        });

        Schema::table('widget_instance_setting', function (Blueprint $table) {
            $table->foreign('widget_instance_id', 'FK_WIDGET_LANGUAGE')
                ->references('widget_instance_id')->on('widget_instance')
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
