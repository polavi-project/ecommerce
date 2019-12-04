<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function Similik\get_css_file_url;
use function Similik\get_current_language_id;
use function Similik\get_js_file_url;
use Similik\Services\Helmet;
use Similik\Services\HtmlDocument;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Locale\Language;

class InitHtmlMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAjax() || $request->getMethod() != "GET")
            return $delegate;
        $this
            ->getContainer()
            ->get(Helmet::class)
            ->addMeta(['charset'=>'utf-8', 'data-react-helmet'=>'true'])
            ->addScript(['src'=> get_js_file_url('production/axios.min.js')]);
        if($request->isAdmin())
            $this
                ->getContainer()
                ->get(Helmet::class)
                ->addScript(['src'=> get_js_file_url('production/tinymce/tinymce.min.js')]);
        $this
            ->getContainer()
            ->get(Helmet::class)
            ->addScript(['src'=> get_js_file_url('production/lodash.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/react.production.min.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/react-dom.production.min.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/prop-types.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/redux.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/react-redux.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/pubsub.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/app.js'), 'type'=>'module'])
            ->addScript(['src'=> get_js_file_url('production/uikit.min.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/uikit-icons.min.js'), 'type'=>'text/javascript'])
            ->addScript(['src'=> get_js_file_url('production/jquery-3.3.1.min.js'), 'type'=>'text/javascript']);

        $this
            ->getContainer()
            ->get(Helmet::class)
            ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('style.css', $request->isAdmin())])
            ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('uikit.min.css', $request->isAdmin())]);

        $response->setContent($this->renderHtml());
        $response->headers->set('Content-Type', 'text/html');

        return $response;
    }

    protected function renderHtml()
    {
        $language = substr(Language::listLanguagesV2()[get_current_language_id()][0], 0, -3);
        ob_start();
        echo "<!DOCTYPE html><html lang='{$language}'>";
        echo "<head>";
            echo $this->getContainer()->get(Helmet::class)->render();
        echo "</head>";
        echo "<body>";
        echo "<div id=\"app\"></div>";
        echo "</body></html>";
        $output = ob_get_clean();

        return $output;
    }
}