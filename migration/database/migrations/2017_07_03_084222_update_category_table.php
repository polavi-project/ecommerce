<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('category', function (Blueprint $table) {
            $table->unsignedInteger('parent_id')->after('category_id')->nullable();
            $table->unsignedSmallInteger('position')->after('include_in_nav')->nullable();
        });

        Schema::table('category', function (Blueprint $table) {
            $table->char('path')->after('position')->nullable();
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
