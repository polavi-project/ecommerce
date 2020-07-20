<?php

$version = "1.0.1";

return [
    "1.0.0" => function(\Polavi\Services\Db\Processor $conn) {
        $settingTable = $conn->executeQuery("SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = :dbName AND TABLE_NAME = \"setting\" LIMIT 0,1", ['dbName'=> $conn->getConfiguration()->getDb()])->fetch(\PDO::FETCH_ASSOC);
        if($settingTable !== false)
            return;
        $conn->executeQuery("CREATE TABLE `setting` (
          `setting_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
          `name` varchar(225) NOT NULL,
          `value` text,
          `language_id` smallint(6) NOT NULL DEFAULT '0',
          `json` smallint(5) unsigned NOT NULL,
          PRIMARY KEY (`setting_id`),
          UNIQUE KEY `SETTING_NAME_LANGUAGE_UNIQUE` (`name`,`language_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Setting'");

        $sampleData = [
            'general_store_name' => 'Polavi Store',
            'general_currency' => 'USD',
            'general_default_language' => 26
        ];
        foreach ($sampleData as $name=> $value) {
            if(is_array($value))
                $conn->getTable('setting')
                    ->insertOnUpdate([
                        'name'=>$name,
                        'value'=>json_encode($value, JSON_NUMERIC_CHECK),
                        'json'=>1,
                        'language_id'=>0
                    ]);
            else
                $conn->getTable('setting')
                    ->insertOnUpdate([
                        'name'=>$name,
                        'value'=>$value,
                        'json'=>0,
                        'language_id'=>0
                    ]);
        }
    },
    "1.0.1" => function(\Polavi\Services\Db\Processor $conn) {
        $conn->getTable('setting')->where("name", "=", "general_store_name")->update(["value" => "Polavi Store testing migration store"]);
    }
];
