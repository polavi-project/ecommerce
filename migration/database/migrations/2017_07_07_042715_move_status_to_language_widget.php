<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MoveStatusToLanguageWidget extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('widget_instance', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('widget_instance_setting', function (Blueprint $table) {
            $table->unsignedSmallInteger('status')->after('language_id')->default(1);
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
