<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUniqueIndexSetting extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('setting', function (Blueprint $table) {
            $table->dropIndex('SETTING_NAME_LANGUAGE_UNIQUE');
        });
        Schema::table('setting', function (Blueprint $table) {
            $table->unique(['name', 'language_id'], 'SETTING_NAME_LANGUAGE_UNIQUE');
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
