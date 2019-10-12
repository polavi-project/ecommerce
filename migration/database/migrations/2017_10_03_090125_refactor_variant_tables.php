<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RefactorVariantTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('variant_item', function (Blueprint $table) {
            $table->dropForeign('FK_VARIANT_ITEM_GROUP');
            $table->dropForeign('FK_PRODUCT_VARIANT_ITEM');
        });

        Schema::dropIfExists('variant_item');

        Schema::table('variant_group', function (Blueprint $table) {
            $table->char('attributes')->after('attribute_group_id');
        });
        Schema::table('variant_group', function (Blueprint $table) {
            $table->dropColumn('attr_one');
            $table->dropColumn('attr_two');
            $table->dropColumn('attr_three');
        });


        Schema::table('product', function (Blueprint $table) {
            $table->unsignedInteger('variant_group_id')->after('product_id')->nullable(true);
        });
        Schema::table('product', function (Blueprint $table) {
            $table->dropColumn('parent_id');
        });
        Schema::disableForeignKeyConstraints();
        Schema::table('product', function (Blueprint $table) {
            $table->foreign('variant_group_id', 'FK_VARIANT_GROUP_PRODUCT')
                ->references('variant_group_id')->on('variant_group')
                ->onDelete('set null');
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
