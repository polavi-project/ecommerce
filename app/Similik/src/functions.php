<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik;

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
use GuzzleHttp\Promise\Promise;
use Imagine\Image\Box;
use Imagine\Imagick\Imagine;
use Similik\Services\Db\Processor;
use Similik\Services\Db\Table;
use Similik\Services\Di\Container;
use Similik\Services\Event\EventDispatcher;
use Similik\Services\Locale\Language;
use Similik\Services\Log\Logger;
use Similik\Services\Routing\Router;

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
    return new Processor();
}

function dispatch_event(string $eventName, array $args = [], EventDispatcher $start = null) {
    static $dispatcher;

    if ($start) {
        $dispatcher = $start;
    } elseif (!$dispatcher) {
        $dispatcher = new EventDispatcher();
    }

    return $dispatcher->dispatch($eventName, $args);
}

function generate_url($routerName, array $params = [], array $query = null)
{
    return the_container()->get(Router::class)->generateUrl($routerName, $params, $query);
}
// TODO: Add filter var function
function subscribe(string $eventName, callable $callback, int $priority = 0, EventDispatcher $start = null)
{
    static $dispatcher;

    if ($start) {
        $dispatcher = $start;
    } elseif (!$dispatcher) {
        $dispatcher = new EventDispatcher();
    }

    $dispatcher->addListener($eventName, $callback, $priority);
}

function get_config(string $name, $defaultValue = null, int $languageId = 0)
{
    $config = [];
    if(file_exists(CACHE_PATH . DS . 'config_cache.php')) {
        $config = include_once (CACHE_PATH . DS . 'config_cache.php');
    }

    if(isset($config[$languageId][$name]))
        return $config[$languageId][$name];

    $settingTable = new Table('setting', new Processor());
    $config = $settingTable->where('name', '=', $name)
        ->andWhere('language_id', '=', $languageId)
        ->fetchOneAssoc();

    if(!$config)
        return $defaultValue;

    return $config['json'] == 1  ? json_decode($config['value'], true) : $config['value'];
}

function get_base_url($secure = false, $isAdmin = false)
{
    if (isset($_SERVER['HTTP_HOST']) && preg_match('/^((\[[0-9a-f:]+\])|(\d{1,3}(\.\d{1,3}){3})|[a-z0-9\-\.]+)(:\d+)?$/i', $_SERVER['HTTP_HOST'])) {
        $base_url = (($secure==true) ? 'https' : 'http').'://'.$_SERVER['HTTP_HOST']
            .substr($_SERVER['SCRIPT_NAME'], 0, strpos($_SERVER['SCRIPT_NAME'], basename($_SERVER['SCRIPT_FILENAME'])));
    } else {
        $base_url = 'http://127.0.0.1/';
    }

    if(!$isAdmin)
        return trim($base_url, '/');
    else
        return trim($base_url, '/') . '/' . ADMIN_PATH;
}

function get_base_url_scheme_less($isAdmin = false)
{
    $url = get_base_url(false, $isAdmin);
    return str_replace(['http:', 'https:'], '', $url);
}

function get_admin_theme_url($secure = false)
{
    return get_base_url($secure) .  '/theme/admin/default';
}

function get_theme_url($secure = false)
{
    $theme_name = get_config('general_theme', 'default');

    return get_base_url($secure) .  '/theme/front/' . $theme_name;
}

function get_js_file_url(string $sub_path, bool $isAdmin = false)
{
    $fileUrl = null;

    if($isAdmin == true) {
        if(file_exists(THEME_PATH . "/admin/default/js/" . $sub_path))
            $fileUrl = get_admin_theme_url() . "/js/" . $sub_path;
        else if(file_exists(JS_PATH . DS . $sub_path))
            $fileUrl = get_base_url() . '/js/' . $sub_path;
    } else {
        $themeName = get_config('general_theme', 'default');
        if(file_exists(THEME_PATH . "/front/{$themeName}/js/" . $sub_path))
            $fileUrl = get_base_url() .  '/theme/front/' . $themeName . "/js/" . $sub_path;
        else if(file_exists(THEME_PATH . "/front/default/js/" . $sub_path))
            $fileUrl = get_base_url() .  '/theme/front/default' . "/js/" . $sub_path;
        else if(file_exists(JS_PATH . DS . $sub_path))
            $fileUrl = get_base_url() . '/js/' . $sub_path;
    }

    if($fileUrl)
        return str_replace(['http:', 'https:'], '', $fileUrl);
    else
        throw new \RuntimeException(sprintf("Requested file %s does not exist", $sub_path) );
}

function get_css_file_url(string $sub_path, bool $isAdmin = false)
{
    $fileUrl = null;

    if($isAdmin == true) {
        $fileUrl = get_admin_theme_url() . "/css/" . $sub_path;
    } else {
        $themeName = get_config('general_theme', 'default');
        if(file_exists(THEME_PATH . "/front/{$themeName}/css/" . $sub_path))
            $fileUrl = get_base_url() .  '/theme/front/' . $themeName . "/css/" . $sub_path;
        else if(file_exists(THEME_PATH . "/front/default/css/" . $sub_path))
            $fileUrl = get_base_url() .  '/theme/front/default' . "/css/" . $sub_path;
    }

    if($fileUrl)
        return str_replace(['http:', 'https:'], '', $fileUrl);
    else
        throw new \RuntimeException(sprintf("Requested file %s does not exist", $sub_path) );
}

function get_default_language_Id() {
    return get_config('general_default_language', 26);
}

function get_default_language_code() {
    return Language::listLanguagesV2()[get_default_language_Id()][0];
}

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