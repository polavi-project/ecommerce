<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreaetTaxRateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tax_rate', function (Blueprint $table) {
            $table->increments('tax_rate_id');
            $table->unsignedSmallInteger('tax_rate_country');
            $table->unsignedSmallInteger('tax_rate_state');
            $table->char('tax_rate_postcode');
            $table->decimal('tax_rate', 12, 4);
            $table->unsignedSmallInteger('tax_rate_compound');
            $table->unsignedSmallInteger('tax_rate_priority');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
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
