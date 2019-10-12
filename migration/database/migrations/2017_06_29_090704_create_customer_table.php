<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('customer');
        Schema::create('customer', function (Blueprint $table) {
            $table->increments('customer_id');
            $table->unsignedSmallInteger('status');
            $table->unsignedInteger('group_id')->nullable();
            $table->char('email');
            $table->char('password');
            $table->char('firstname')->nullable();
            $table->char('lastname')->nullable();
            $table->char('gender')->nullable();
            $table->char('dob')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('customer', function (Blueprint $table) {
            $table->unique('email', 'EMAIL_UNIQUE');
        });

        Schema::table('customer', function (Blueprint $table) {
            $table->foreign('group_id', 'FK_CUSTOMER_GROUP')
                ->references('customer_group_id')->on('customer_group')
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
