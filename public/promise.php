<?php

declare(strict_types=1);

use GuzzleHttp\Promise\Promise;
use function Myapp\_mysql;

define('DS', DIRECTORY_SEPARATOR);
define('PS', PATH_SEPARATOR);
define('LIBRARY_PATH', dirname(dirname(__FILE__)) . DS . 'core' . DS . 'Myapp' . DS . 'src' . DS . 'Library');
define('MODULE_PATH', dirname(dirname(__FILE__)) . DS . 'core' . DS . 'Myapp' . DS . 'src' . DS . 'Module');
define('EXTENSION_PATH', dirname(dirname(__FILE__)) . DS . 'extension');
define('CACHE_PATH', dirname(dirname(__FILE__)) . DS . 'cache');
define('JS_PATH', dirname(__FILE__) . DS . 'js');
define('MEDIA_PATH', dirname(__FILE__) . DS . 'media');
define('THEME_PATH', dirname(__FILE__) . DS . 'theme');

if (php_sapi_name() === 'cli-server'
    && is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))
) {
    return false;
}

require '../vendor/autoload.php';

$promise = new Promise(function() use (&$promise) {
    $promise->resolve(1);
});

$promise->then(function($value) {
    echo $value;
});

$promise2 = new Promise(function() use (&$promise2) {
    $promise2->resolve(2);
});
$promise2->then(function($value) {
    echo $value;
});
$promise->wait();
$promise2->wait();

echo $promise2->getState();
echo "End";