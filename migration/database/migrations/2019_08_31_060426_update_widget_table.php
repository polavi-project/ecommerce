<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateWidgetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cms_widget', function (Blueprint $table) {
            $table->smallInteger('status')->default(1)->after('type');
            $table->string('name')->nullable(true)->after('type');
            $table->string('display_setting')->nullable(true)->after('setting');
            $table->smallInteger('language_id')->nullable(true)->after('setting');
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
