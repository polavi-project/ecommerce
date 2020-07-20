<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi;

use GraphQL\Type\Definition\BooleanType;
use GraphQL\Type\Definition\FieldArgument;
use GraphQL\Type\Definition\FloatType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\IntType;
use GraphQL\Type\Definition\LeafType;
use GraphQL\Type\Definition\ListOfType;
use GraphQL\Type\Definition\NonNull;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\WrappingType;
use GraphQL\Type\Schema;
use Imagine\Image\Box;
use Imagine\Imagick\Imagine;
use Polavi\Services\Db\Processor;
use Polavi\Services\Di\Container;
use Polavi\Services\Event\EventDispatcher;
use Polavi\Services\Locale\Language;
use Polavi\Services\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;

define(
    "CORE_MODULES",
    [
        "Catalog",
        "Checkout",
        "Cms",
        "Cod",
        "Customer",
        "Discount",
        "FlatRate",
        "GoogleAnalytics",
        "Graphql",
        "Migration",
        "Order",
        "SendGrid",
        "Setting",
        "Tax",
        "User"
    ]
);

function the_container(Container $start = null) : Container
{
    static $container;

    if ($start) {
        $container = $start;
    } elseif (!$container) {
        $container = new Container();
    }

    return $container;
}

function _mysql()
{
    return the_container()->get(Processor::class);
}

function dispatch_event(string $eventName, array $args = []) {
    the_container()->get(EventDispatcher::class)->dispatch($eventName, $args);
}

function create_mutable_var($name, $value, array $context = []) {
    $listeners = the_container()->get(EventDispatcher::class)->getListeners($name);
    if(empty($listeners))
        return $value;

    foreach ($listeners as $listener) {
        $handler = $listener['handler'];
        $value = $handler($value, $context);
    }

    return $value;
}

// TODO: Add filter var function
function subscribe(string $eventName, callable $callback, int $priority = 0)
{
    the_container()->get(EventDispatcher::class)->addListener($eventName, $callback, $priority);
}

/**
 * @param $routerName
 * @param array $params
 * @param array|null $query
 * @return string
 */
function generate_url($routerName, array $params = [], array $query = null)
{
    return the_container()->get(Router::class)->generateUrl($routerName, $params, $query);
}

/**
 * @param string $name
 * @param null $defaultValue
 * @param int $languageId
 * @return mixed|null
 */
function get_config(string $name, $defaultValue = null, int $languageId = 0)
{
    if(!file_exists(CONFIG_PATH . DS . 'config.php'))
        return $defaultValue;
    static $configCache = [];

    if(file_exists(CACHE_PATH . DS . 'config_cache.php') && empty($configCache)) {
        $configCache = include_once (CACHE_PATH . DS . 'config_cache.php');
    }

    if(isset($configCache[$languageId][$name]))
        return $configCache[$languageId][$name];
    else if(isset($configCache[0][$name]))
        return $configCache[0][$name];

    $config = _mysql()->getTable('setting')->where('name', '=', $name)
        ->andWhere('language_id', '=', $languageId)
        ->fetchOneAssoc();
    if($config) {
        $configCache[$languageId][$name] = $config['json'] == 1  ? json_decode($config['value'], true) : $config['value'];
        return $configCache[$languageId][$name];
    } else {
        $config = _mysql()->getTable('setting')->where('name', '=', $name)
            ->andWhere('language_id', '=', 0)
            ->fetchOneAssoc();
        if($config) {
            $configCache[0][$name] = $config['json'] == 1  ? json_decode($config['value'], true) : $config['value'];
            return $configCache[0][$name];
        } else {
            return $defaultValue;
        }
    }
}

/**
 * @param bool $isAdmin
 * @return string
 */
function get_base_url($isAdmin = false)
{
    $secure = get_config('general_https', 0, 0) == 0 ? false: true;
    if (isset($_SERVER['HTTP_HOST']) && preg_match('/^((\[[0-9a-f:]+\])|(\d{1,3}(\.\d{1,3}){3})|[a-z0-9\-\.]+)(:\d+)?$/i', $_SERVER['HTTP_HOST'])) {
        $baseUrl = (($secure == true) ? 'https' : 'http').'://'.$_SERVER['HTTP_HOST']
            .substr($_SERVER['SCRIPT_NAME'], 0, strpos($_SERVER['SCRIPT_NAME'], basename($_SERVER['SCRIPT_FILENAME'])));
    } else {
        $baseUrl = 'http://127.0.0.1/';
    }

    if(!$isAdmin)
        return trim($baseUrl, '/');
    else
        return trim($baseUrl, '/') . '/' . ADMIN_PATH;
}

/**
 * @param bool $isAdmin
 * @return mixed
 */
function get_base_url_scheme_less($isAdmin = false)
{
    $url = get_base_url($isAdmin);
    return str_replace(['http:', 'https:'], '', $url);
}

/**
 * @return string
 */
function get_admin_theme_url()
{
    return get_base_url() .  '/public/theme/admin/default';
}

/**
 * @return string
 */
function get_theme_url()
{
    $themeName = get_config('general_theme', 'default');

    return get_base_url() .  '/public/theme/front/' . $themeName;
}

/**
 * @param string $subPath
 * @param bool $isAdmin
 * @return mixed
 */
function get_js_file_url(string $subPath, bool $isAdmin = false)
{
    $fileUrl = null;

    if($isAdmin == true) {
        if(file_exists(THEME_PATH . "/admin/default/js/" . $subPath))
            $fileUrl = get_admin_theme_url() . "/js/" . $subPath;
        else if(file_exists(JS_PATH . DS . $subPath))
            $fileUrl = get_base_url() . '/public/js/' . $subPath;
    } else {
        $themeName = get_config('general_theme', 'default');
        if(file_exists(THEME_PATH . "/front/{$themeName}/js/" . $subPath))
            $fileUrl = get_base_url() .  '/public/theme/front/' . $themeName . "/js/" . $subPath;
        else if(file_exists(THEME_PATH . "/front/default/js/" . $subPath))
            $fileUrl = get_base_url() .  '/public/theme/front/default' . "/js/" . $subPath;
        else if(file_exists(JS_PATH . DS . $subPath))
            $fileUrl = get_base_url() . '/public/js/' . $subPath;
    }

    if($fileUrl)
        return str_replace(['http:', 'https:'], '', $fileUrl);
    else
        throw new \RuntimeException(sprintf("Requested file %s does not exist", $subPath) );
}

/**
 * @param string $subPath
 * @param bool $isAdmin
 * @return mixed
 */
function get_css_file_url(string $subPath, bool $isAdmin = false)
{
    $fileUrl = null;

    if($isAdmin == true) {
        $fileUrl = get_admin_theme_url() . "/css/" . $subPath;
    } else {
        $themeName = get_config('general_theme', 'default');
        if(file_exists(THEME_PATH . "/front/{$themeName}/css/" . $subPath))
            $fileUrl = get_base_url() .  '/public/theme/front/' . $themeName . "/css/" . $subPath;
        else if(file_exists(THEME_PATH . "/front/default/css/" . $subPath))
            $fileUrl = get_base_url() .  '/public/theme/front/default' . "/css/" . $subPath;
    }

    if($fileUrl)
        return str_replace(['http:', 'https:'], '', $fileUrl);
    else
        throw new \RuntimeException(sprintf("Requested file %s does not exist", $subPath) );
}

/**
 * @return mixed|null
 */
function get_default_language_Id() {
    return get_config('general_default_language', 26);
}

/**
 * @return mixed
 */
function get_default_language_code() {
    return Language::listLanguagesV2()[get_default_language_Id()][0];
}

/**
 * @return int
 */
function get_current_language_id() {
    return (int)the_container()->get(Session::class)->get('languageId', get_default_language_Id());
}

/**
 * @return mixed|null
 */
function get_display_languages() {
    $languages = get_config('general_languages', []);
    array_walk($languages, function(&$language_id) {
        $language = [
            'id'=>$language_id,
            'code'=> Language::listLanguagesV2()[$language_id][0],
            'name'=> Language::listLanguagesV2()[$language_id][1]
        ];
        $language_id = $language;
    });

    return $languages;
}

function flatten_array(array $array) {
    $result = array();
    array_walk_recursive($array, function($a) use (&$result) { $result[] = $a; });

    return $result;
}


/**
 * This function get all field in a type. Do not overuse it
 * @param Schema $schema
 * @param string $type
 * @param string|null $fieldName
 * @return string
 */
function dirty_output_query(Schema $schema, string $type, string $fieldName = null) {
    $query = '';
    $type = $schema->getType($type);

    if(Type::isLeafType($type))
        return "{$fieldName} ";
    if($type instanceof WrappingType)
        $type = $type->getWrappedType();

    if($type instanceof ObjectType) {
        $query = "{$fieldName} { ";
        $fields = $type->getFields();
        foreach ($fields as $name=> $field) {
            $type = $field->getType();
            if($field->getType() instanceof WrappingType)
                $type = $field->getType()->getWrappedType();
            if($type instanceof LeafType)
                $query .= "{$name} ";

            if($type instanceof ObjectType)
                $query .= dirty_output_query($schema, $name, $type);
        }
    }

    $query .= "} ";

    return $query;
}

function buildInputQuery(InputObjectType $type, $data) {
    $query = "{";
    $fields = $type->getFields();

    foreach ($fields as $name=>$field) {
        if(isset($data[$name]))
            if($field->type instanceof ListOfType) {
                $type = $field->type->getWrappedType();
                if(isset($data[$name]) and is_array($data[$name])) {
                    $query .= " {$name}: [";
                    foreach ($data[$name] as $i) {
                        if($type instanceof InputObjectType and is_array($i))
                            $query .= buildInputQuery($type, $i);
                        if($type instanceof ScalarType)
                            if($type instanceof IntType || $type instanceof FloatType || $type instanceof BooleanType)
                                $query .= sprintf('%s: %s ', $name, $data[$name]);
                            else{
                                $query .= sprintf('%s: "%s" ', $name, preg_replace('/([^\\\\])\"/','$1\"', $data[$name]));
                            }
                    }
                    $query .= "]";
                }
            } else if($field->type instanceof NonNull) {
                $type = $field->type->getWrappedType();
                if($type instanceof InputObjectType and is_array($data[$name]))
                    $query .= buildInputQuery($type, $data[$name]);
                if($type instanceof ScalarType)
                    if($type instanceof IntType || $type instanceof FloatType || $type instanceof BooleanType)
                        $query .= sprintf('%s: %s ', $name, $data[$name]);
                    else {
                        $query .= sprintf('%s: "%s" ', $name, preg_replace('/([^\\\\])\"/','$1\"', $data[$name]));
                    }
            } else if($field->type instanceof ScalarType) {
                if($field->type instanceof IntType || $field->type instanceof FloatType || $field->type instanceof BooleanType)
                    $query .= sprintf('%s: %s ', $name, $data[$name]);
                else{
                    $query .= sprintf('%s: "%s" ', $name, preg_replace('/([^\\\\])\"/','$1\"', $data[$name]));
                }
            } else if($field->type instanceof InputObjectType) {
                if(is_array($data[$name]))
                    $query .= buildInputQuery($type, $data[$name]);
            }
    }
    $query .="}";
    return $query;
}

/**
 * @param FieldArgument[] $args
 * @param $data
 * @return string
 */
function buildQueryArgs(array $args, $data) {
    $query = "(";

    foreach ($args as $field) {
        $name = $field->name;
        if(isset($data[$name]))
            if($field->getType() instanceof ListOfType) {
                $type = $field->getType()->getWrappedType();
                if(isset($data[$name]) and is_array($data[$name])) {
                    $query .= "{$name}: [";
                    foreach ($data[$name] as $i) {
                        if($type instanceof InputObjectType and is_array($i))
                            $query .= "{$name} : " . buildInputQuery($type, $i) . " ";
                        if($type instanceof ScalarType)
                            if($type instanceof IntType || $type instanceof FloatType || $type instanceof BooleanType)
                                $query .= "{$name}: {$data[$name]} ";
                            else
                                $query .= "{$name}: \"{$data[$name]}\" ";
                    }
                    $query .= "]";
                }
            } else if($field->getType() instanceof NonNull) {
                $type = $field->getType()->getWrappedType();
                if($type instanceof InputObjectType and is_array($data[$name]))
                    $query .= "{$name} : " . buildInputQuery($type, $data[$name]) . " ";
                if($type instanceof ScalarType)
                    if($type instanceof IntType || $type instanceof FloatType || $type instanceof BooleanType)
                        $query .= "{$name}: {$data[$name]} ";
                    else
                        $query .= "{$name}: \"{$data[$name]}\" ";
            } else if($field->getType() instanceof ScalarType) {
                if($field->getType() instanceof IntType || $field->getType() instanceof FloatType || $field->getType() instanceof BooleanType)
                    $query .= "{$name}: {$data[$name]} ";
                else
                    $query .= "{$name}: \"{$data[$name]}\" ";
            } else if($field->getType() instanceof InputObjectType) {
                if(is_array($data[$name]))
                    $query .= "{$name} : " . buildInputQuery($field->getType(), $data[$name]) . " ";
            }
    }
    $query .=")";
    if(str_replace(' ', '', $query) == "()")
        return null;
    return $query;
}

function query_all_field_of_type(ObjectType $type, int $level) {

}
function str_replace_last( $search , $replace , $str ) {
    if(!$str)
        return $str;
    if( ( $pos = strrpos( $str , $search ) ) !== false ) {
        $searchLength  = strlen( $search );
        $str = substr_replace( $str , $replace , $pos , $searchLength );
    }
    return $str;
}

/**
 * @param string $path
 * @param int $width
 * @param int $height
 * @return bool|\Imagine\Image\ImageInterface|object
 */
function resize_image(string $path, int $width, int $height) {
    if (extension_loaded('imagick')){
        $imagine = new Imagine();
    } else if (extension_loaded('gd')) {
        $imagine = new \Imagine\Gd\Imagine();
    } else {
        // TODO: Should log a message
        return false;
    }

    $image = $imagine->open($path);
    $imageW = $image->getSize()->getWidth();
    $imageH = $image->getSize()->getHeight();
    if($imageW <= $width && $imageH <= $height) {
        return $image;
    } else {
        $wRatio = $imageW / $width;
        $hRatio = $imageH / $height;
        if($wRatio > $hRatio) {
            $height = $imageH / $wRatio;
        } else {
            $width = $imageW / $hRatio;
        }
        $size = new Box($width, $height);
        return $image->resize($size);
    }
}

/**
 * Find an element in an array and return default value if not found
 * @param $array
 * @param callable $callback
 * @param null $default
 * @return |null
 */
function array_find($array, callable $callback, $default = null) {
    if(!is_array($array))
        return $default;
    foreach ($array as $key => $value) {
        $result = $callback($value, $key);
        if ($result) {
            return $result;
        }
    }

    return $default;
}

function _unique_number()
{
    static $array;
    if (!$array) {
        $array = [];
    }
    $array[] = null;

    return count($array);
}