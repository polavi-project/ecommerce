<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomerAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        Schema::create('customer_address', function (Blueprint $table) {
//            $table->increments('customer_address_id');
//            $table->integer('customer_id');
//            $table->string('firstname')->nulable(true);
//            $table->string('lastname')->nulable(true);
//            $table->string('telephone')->nulable(true);
//            $table->string('address_1')->nulable(true);
//            $table->string('address_2')->nulable(true);
//            $table->string('postcode')->nulable(true);
//            $table->string('city')->nulable(true);
//            $table->string('province')->nulable(true);
//            $table->string('country');
//            $table->timestamp('created_at')->useCurrent();
//            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
//        });
        Schema::table('customer_address', function (Blueprint $table) {
            $table->dropColumn('customer_id');
        });
        Schema::table('customer_address', function (Blueprint $table) {
            $table->unsignedInteger('customer_id')->after('customer_address_id');
        });
        Schema::table('customer_address', function (Blueprint $table) {
            $table->foreign('customer_id', 'FK_CUSTOMER_ADDRESS_LINK')
                ->references('customer_id')->on('customer')
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
