<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWidgetTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('widget_instance_setting');
        Schema::dropIfExists('widget_instance');
        Schema::create('cms_widget', function (Blueprint $table) {
            $table->increments('cms_widget_id');
            $table->smallInteger('status');
            $table->char('type');
            $table->char('language');
            $table->char('name');
            $table->char('area');
            $table->smallInteger('sort_order');
            $table->char('page');
            $table->text('setting');
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
