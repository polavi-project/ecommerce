<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category', function (Blueprint $table) {
            $table->increments('category_id');
            $table->unsignedSmallInteger('include_in_nav');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

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
