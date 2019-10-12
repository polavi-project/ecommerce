<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductCategoryTable2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_category', function (Blueprint $table) {
            $table->increments('product_category_id');
            $table->unsignedInteger('category_id');
            $table->unsignedInteger('product_id');
            $table->unique(['category_id', 'product_id'], 'PRODUCT_CATEGORY_UNIQUE');
        });

        Schema::table('product_category', function (Blueprint $table) {
            $table->foreign('product_id', 'FK_PRODUCT_CATEGORY_LINK')
                ->references('product_id')->on('product')
                ->onDelete('cascade');
        });
        Schema::table('product_category', function (Blueprint $table) {
            $table->foreign('category_id', 'FK_CATEGORY_PRODUCT_LINK')
                ->references('category_id')->on('category')
                ->onDelete('cascade');
        });
        Schema::table('product', function (Blueprint $table) {
            $table->dropColumn('category');
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
