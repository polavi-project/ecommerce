<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddingCustomerInfoToOrder extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn('invoice_id');
            $table->string('customer_email')->after('customer_id');
            $table->string('customer_firstname')->after('customer_email');
            $table->string('customer_lastname')->after('customer_firstname');
            $table->dateTime('customer_dob')->after('customer_lastname');
            $table->unsignedSmallInteger('customer_gender')->after('customer_dob');
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
