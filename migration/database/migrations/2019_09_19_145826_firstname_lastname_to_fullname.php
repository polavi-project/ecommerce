<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class FirstnameLastnameToFullname extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('admin_user', function (Blueprint $table) {
            $table->renameColumn('firstname', 'full_name');
            $table->dropColumn('lastname');
        });

        Schema::table('customer', function (Blueprint $table) {
            $table->renameColumn('firstname', 'full_name');
            $table->dropColumn('lastname');
        });
        Schema::table('customer_address', function (Blueprint $table) {
            $table->renameColumn('firstname', 'full_name');
            $table->dropColumn('lastname');
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
