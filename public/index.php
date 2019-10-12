<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

define('DS', DIRECTORY_SEPARATOR);
define('PS', PATH_SEPARATOR);
define('LIBRARY_PATH', dirname(dirname(__FILE__)) . DS . 'app' . DS . 'Similik' . DS . 'src' . DS . 'Library');
define('MODULE_PATH', dirname(dirname(__FILE__)) . DS . 'app' . DS . 'Similik' . DS . 'src' . DS . 'Module');
define('EXTENSION_PATH', dirname(dirname(__FILE__)) . DS . 'extension');
define('VAR_PATH', dirname(dirname(__FILE__)) . DS . 'var');
define('CACHE_PATH', dirname(dirname(__FILE__)) . DS . 'var' . DS . 'cache');
define('LOG_PATH', dirname(dirname(__FILE__)) . DS . 'var' . DS . 'log');
define('JS_PATH', dirname(__FILE__) . DS . 'js');
define('MEDIA_PATH', dirname(__FILE__) . DS . 'media');
define('THEME_PATH', dirname(__FILE__) . DS . 'theme');

if (php_sapi_name() === 'cli-server'
    && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))
) {
    return false;
}

require '../vendor/autoload.php';

require '../config/config.php';

(function() {
    $app = new \Similik\App();
    $app->registerDefaultService();

    $app->run();
})();