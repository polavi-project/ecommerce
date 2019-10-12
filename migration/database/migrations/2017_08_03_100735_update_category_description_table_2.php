<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCategoryDescriptionTable2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('category_description', function (Blueprint $table) {
            $table->text('meta_title')->nullable(true)->change();
            $table->text('meta_keywords')->nullable(true)->change();
            $table->longText('meta_description')->nullable(true)->change();
            $table->longText('description')->nullable(true)->change();
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
