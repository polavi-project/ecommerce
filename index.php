<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

use Polavi\Services\Routing\Router;
use Symfony\Component\Filesystem\Filesystem;

define('DS', DIRECTORY_SEPARATOR);
define('PS', PATH_SEPARATOR);
define('LIBRARY_PATH', dirname(__FILE__) . DS . 'app' . DS . 'Polavi' . DS . 'src' . DS . 'Library');
define('MODULE_PATH', dirname(__FILE__) . DS . 'app' . DS . 'Polavi' . DS . 'src' . DS . 'Module');
define('COMMUNITY_MODULE_PATH', dirname(__FILE__) . DS . 'app' . DS . 'Community');
define('EXTENSION_PATH', dirname(__FILE__) . DS . 'extension');
define('CONFIG_PATH', dirname(__FILE__) . DS . 'config');
define('VAR_PATH', dirname(__FILE__) . DS . 'var');
define('CACHE_PATH', dirname(__FILE__) . DS . 'var' . DS . 'cache');
define('LOG_PATH', dirname(__FILE__) . DS . 'var' . DS . 'log');
define('JS_PATH', dirname(__FILE__) . DS . 'public' . DS . 'js');
define('MEDIA_PATH', dirname(__FILE__) . DS . 'public' . DS . 'media');
define('THEME_PATH', dirname(__FILE__) . DS . 'public' . DS . 'theme');
define('ADMIN_PATH', 'admin');


require './vendor/autoload.php';

(function() {
    $app = new \Polavi\App();
    $app->registerDefaultService();

    $app->run();
})();