<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('admin_user');
        Schema::create('admin_user', function (Blueprint $table) {
            $table->increments('admin_user_id');
            $table->unsignedSmallInteger('status');
            $table->unsignedSmallInteger('role_id');
            $table->char('email');
            $table->char('password');
            $table->char('firstname')->nullable();
            $table->char('lastname')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->default(\Illuminate\Support\Facades\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('admin_user', function (Blueprint $table) {
            $table->unique('email', 'EMAIL_UNIQUE');
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
