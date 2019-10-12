<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaymentTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
            CREATE TABLE `payment_transaction` (
              `payment_transaction_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `payment_transaction_order_id` int(10) unsigned NOT NULL,
              `transaction_id` varchar(100) DEFAULT NULL,
              `parent_transaction_id` varchar(100) DEFAULT NULL,
              `transaction_type` varchar(15) DEFAULT NULL,
              `additional_information` text,
              `created_at` timestamp NOT NULL,
              PRIMARY KEY (`payment_transaction_id`),
              UNIQUE KEY `UNQ_PAYMENT_TRANSACTION_ID_ORDER_ID` (`payment_transaction_order_id`,`transaction_id`),
              CONSTRAINT `FK_PAYMENT_TRANSACTION_ORDER` FOREIGN KEY (`payment_transaction_order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ');
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
