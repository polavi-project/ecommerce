<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreaetCategoryDescriptionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('category_description');
        Schema::create('category_description', function (Blueprint $table) {
            $table->increments('category_description_id');
            $table->unsignedInteger('category_id');
            $table->unsignedInteger('language_id');
            $table->text('name');
            $table->longText('description');
            $table->text('meta_title');
            $table->text('meta_keywords');
            $table->longText('meta_description');
            $table->char('seo_key');
        });

        Schema::table('category_description', function (Blueprint $table) {
            $table->unique(['category_id', 'language_id'], 'CATEGORY_DESCRIPTION_LANGUAGE_UNIQUE');
        });

        Schema::table('category_description', function (Blueprint $table) {
            $table->foreign('category_id', 'FK_CATEGORY_DESCRIPTION')
                ->references('category_id')->on('category')
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
