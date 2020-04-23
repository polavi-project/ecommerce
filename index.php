<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

use Similik\Services\Routing\Router;
use Symfony\Component\Filesystem\Filesystem;

define('DS', DIRECTORY_SEPARATOR);
define('PS', PATH_SEPARATOR);
define('LIBRARY_PATH', dirname(__FILE__) . DS . 'app' . DS . 'Similik' . DS . 'src' . DS . 'Library');
define('MODULE_PATH', dirname(__FILE__) . DS . 'app' . DS . 'Similik' . DS . 'src' . DS . 'Module');
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

if(file_exists(CONFIG_PATH . DS . 'config.php'))
    require './config/config.php';

else if(!strpos($_SERVER['REQUEST_URI'], 'install')) {
    $redirect = new \Symfony\Component\HttpFoundation\RedirectResponse(\Similik\get_base_url() . '/install');
    return $redirect->send();
}

(function() {
    $app = new \Similik\App();
    $app->registerDefaultService();

    $app->run();
})();