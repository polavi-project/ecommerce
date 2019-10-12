<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSettingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('setting', function (Blueprint $table) {
            $table->unsignedInteger('language_id')->after('value');
        });
        Schema::table('setting', function (Blueprint $table) {
            $table->unsignedSmallInteger('json')->after('language_id');
        });
        Schema::table('setting', function (Blueprint $table) {
            $table->unique('name', 'SETTING_NAME_UNIQUE');
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
