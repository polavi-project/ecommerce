<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateOrderAddressTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('order_address', function (Blueprint $table) {
            $table->unsignedInteger('order_address_order_id')->nullable(false)->change();
            $table->renameColumn('address', 'address_1');
        });

        Schema::table('order_address', function (Blueprint $table) {
            $table->string('address_type')->nullable(false)->change();
        });

        Schema::table('order_address', function (Blueprint $table) {
            $table->string('address_2')->after('address_1')->nullable(true);
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
