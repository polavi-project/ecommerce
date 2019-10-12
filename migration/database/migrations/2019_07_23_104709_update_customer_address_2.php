<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCustomerAddress2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customer_address', function (Blueprint $table) {
            $table->string('firstname')->nullable(true)->change();
            $table->string('lastname')->nullable(true)->change();
            $table->string('telephone')->nullable(true)->change();
            $table->string('address_1')->nullable(true)->change();
            $table->string('address_2')->nullable(true)->change();
            $table->string('postcode')->nullable(true)->change();
            $table->string('city')->nullable(true)->change();
            $table->string('province')->nullable(true)->change();
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
