<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStatusToLanguageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('language', function (Blueprint $table) {
            $table->unsignedSmallInteger('status')->after('is_default')->default(1);
        });

        Schema::table('language', function (Blueprint $table) {
            $table->unique('language', 'LANGUAGE_UNIQUE');
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
