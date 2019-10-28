<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services;

use function Similik\get_base_url;
use function Similik\get_config;
use function Similik\get_css_file_url;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Locale\Language;

class HtmlDocument
{
    /**@var Helmet $helmet*/
    protected $helmet;

    protected $lang = 'en';

    protected $charset = 'UTF-8';

    protected $rootId = 'app';

    protected $rootClasses = '';

    protected $jsFiles = [];

    protected $cssFiles = [];

    protected $htmlBeforeCloseHead;

    protected $htmlBeforeReact;

    protected $htmlAfterReact;

    /** @var  Request $request */
    private $request;

    public function __construct(Request $request, Helmet $helmet)
    {
        $this->request = $request;
        $this->helmet = $helmet;
        $this->init();
    }

    public function init()
    {
        $this->addCssFile('style.css');
        $this->addCssFile('uikit.min.css');
        $this->addjsFile('production/jquery-3.3.1.min.js', 0);
        $this->addjsFile('production/observer.js', 10);
    }

    public function addJsFile($path, $sortOrder = null, $type="text/javascript")
    {
        if(!filter_var($path, FILTER_VALIDATE_URL))
            $path = get_js_file_url($path, $this->request->isAdmin());
        else
            $path = str_replace(['http:', 'https:'], '', $path);
        if(!isset($this->jsFiles[(int)$sortOrder])) {
            $this->jsFiles[(int)$sortOrder] = [
                'path'=>$path,
                'type'=>$type
            ];
        } else {
            array_splice($this->jsFiles, (int)$sortOrder + 1, 0, [[
                'path'=>$path,
                'type'=>$type
            ]]);
        }

        return $this;
    }

    public function addCssFile($path, $sortOrder = null)
    {
        if(!filter_var($path, FILTER_VALIDATE_URL))
            $path = get_css_file_url($path, $this->request->isAdmin());
        else
            $path = str_replace(['http:', 'https:'], '', $path);
        if(!isset($this->cssFiles[(int)$sortOrder])) {
            $this->cssFiles[(int)$sortOrder] = $path;
        } else {
            array_splice($this->cssFiles, (int)$sortOrder + 1, 0, [$path]);
        }

        return $this;
    }

    /**
     * @param string $lang
     * @return $this
     */
    public function setLang($lang)
    {
        $this->lang = $lang;
        return $this;
    }

    /**
     * @param string $rootId
     * @return $this
     */
    public function setRootId($rootId)
    {
        $this->rootId = $rootId;
        return $this;
    }

    /**
     * @param string $charset
     * @return $this
     */
    public function setCharset($charset)
    {
        $this->charset = $charset;
        return $this;
    }

    /**
     * @param string $rootClasses
     * @return $this
     */
    public function setRootClasses($rootClasses)
    {
        $this->rootClasses = $rootClasses;
        return $this;
    }

    /**
     * @return string
     */
    public function getRootClasses()
    {
        return $this->rootClasses;
    }

    /**
     * @return mixed
     */
    public function getHtmlAfterReact()
    {
        return $this->htmlAfterReact;
    }

    /**
     * @return mixed
     */
    public function getHtmlBeforeReact()
    {
        return $this->htmlBeforeReact;
    }

    /**
     * @return mixed
     */
    public function getHtmlBeforeCloseHead()
    {
        return $this->htmlBeforeCloseHead;
    }

    /**
     * @param mixed $htmlAfterReact
     */
    public function setHtmlAfterReact($htmlAfterReact)
    {
        $this->htmlAfterReact = $htmlAfterReact;
    }

    /**
     * @param mixed $htmlBeforeReact
     */
    public function setHtmlBeforeReact($htmlBeforeReact)
    {
        $this->htmlBeforeReact = $htmlBeforeReact;
    }

    /**
     * @param mixed $htmlBeforeCloseHead
     */
    public function setHtmlBeforeCloseHead($htmlBeforeCloseHead)
    {
        $this->htmlBeforeCloseHead = $htmlBeforeCloseHead;
    }

    /**
     * @return string
     */
    public function getLang()
    {
        return $this->lang;
    }

    /**
     * @return string
     */
    public function getCharset()
    {
        return $this->charset;
    }

    /**
     * @return string
     */
    public function getRootId()
    {
        return $this->rootId;
    }

    /**
     * @return array
     */
    public function getJsFiles()
    {
        $files = $this->jsFiles;
        ksort($files);
        return $files;
    }

    /**
     * @return array
     */
    public function getCssFiles()
    {
        return $this->cssFiles;
    }

    public function getHtml(array $jsonData = [])
    {
        $language = $this->request->getSession()->get('language', get_default_language_Id());;
        $language_code = Language::listLanguagesV2()[$language][0];
        ob_start();
        echo "<!DOCTYPE html><html lang='{$this->getLang()}'>";
        echo "<head><meta charset=\"{$this->getCharset()}\" data-react-helmet=\"true\"/>";
        echo $this->helmet->render();
        foreach ($this->getCssFiles() as $file) {
            echo "<link rel=\"stylesheet\" href=\"{$file}\"/>";
        }
        if($this->request->isAdmin())
            echo "<script crossorigin src=\"".get_js_file_url('production/tinymce/tinymce.min.js')."\"></script>";
        echo "<script crossorigin src=\"".get_js_file_url('production/lodash.js')."\"></script>";
        echo "<script crossorigin src=\"".get_js_file_url('production/react.js')."\"></script>";
        echo "<script crossorigin src=\"https://unpkg.com/react-dom@16/umd/react-dom.development.js\"></script>";
        echo "<script crossorigin src=\"https://unpkg.com/prop-types@15.6/prop-types.js\"></script>";
        echo "<script crossorigin src=\"".get_js_file_url('production/redux.js')."\"></script>";
        echo "<script crossorigin src=\"https://cdnjs.cloudflare.com/ajax/libs/react-redux/7.1.0/react-redux.js\"></script>";

        foreach ($this->getJsFiles() as $file) {
            echo "<script type=\"{$file['type']}\" src=\"{$file['path']}\"></script>";
        }

        echo "<script crossorigin src=\"https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.7.0/pubsub.js\"></script>";
//        $format = "<script type=\"text/javascript\">
////<![CDATA[
//base_url = \"%s\";
//language = \"%s\";
//currency = \"%s\";
//data = %s;
////]]>
//</script>";
//
//        echo sprintf($format,
//            get_base_url(false, $this->request->isAdmin()),
//            $language_code,
//            get_config('general_currency', 'USD'),
//            json_encode($jsonData)
//        );
        echo $this->getHtmlBeforeCloseHead();
        echo "</head>";
        echo "<body>";
        echo "<div id=\"{$this->getRootId()}\" class=\"{$this->getRootClasses()}\"></div>";
        echo $this->getHtmlBeforeReact();
        echo "<script type=\"module\" src=\"".get_js_file_url('production/app.js')."\"></script>";
        echo "<script src=\"".get_js_file_url('production/uikit.min.js')."\"></script>";
        echo "<script src=\"".get_js_file_url('production/uikit-icons.min.js')."\"></script>";
        echo $this->getHtmlAfterReact();
        echo "</body></html>";
        $output = ob_get_clean();

        return $output;
    }

    /**
     * @return Request
     */
    public function getRequest(): Request
    {
        return $this->request;
    }

    /**
     * @return Helmet
     */
    public function getHelmet(): Helmet
    {
        return $this->helmet;
    }
}