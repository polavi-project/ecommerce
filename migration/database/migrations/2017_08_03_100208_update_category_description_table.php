<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCategoryDescriptionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('category_description', function (Blueprint $table) {
            $table->text('meta_title')->nullable(false)->change();
            $table->text('meta_keywords')->nullable(false)->change();
            $table->longText('meta_description')->nullable(false)->change();
            $table->longText('description')->nullable(false)->change();
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
