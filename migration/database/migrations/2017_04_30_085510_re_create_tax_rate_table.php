<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ReCreateTaxRateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('tax_rate');
        Schema::dropIfExists('tax_class');

        Schema::create('tax_class', function (Blueprint $table) {
            $table->increments('tax_class_id');
            $table->char('name');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::create('tax_rate', function (Blueprint $table) {
            $table->increments('tax_rate_id');
            $table->unsignedInteger('tax_class_id');
            $table->char('country', 5)->default('*');
            $table->char('region', 5)->default('*');
            $table->char('postcode')->default('*');
            $table->decimal('rate', 12, 4);
            $table->unsignedSmallInteger('is_compound')->default('0');
            $table->unsignedSmallInteger('priority')->default('0');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
        Schema::table('tax_rate', function (Blueprint $table) {
            $table->foreign('tax_class_id', 'FK_TAX_CLASS')
                ->references('tax_class_id')->on('tax_class')
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
