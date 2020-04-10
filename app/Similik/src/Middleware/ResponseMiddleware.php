<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Middleware;

use function Similik\get_admin_theme_url;
use function Similik\get_css_file_url;
use function Similik\get_current_language_id;
use function Similik\get_js_file_url;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Locale\Language;

class ResponseMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response)
    {
        if(
            !$request->isAjax() &&
            $request->attributes->get('_matched_route') != 'graphql.api' &&
            $request->attributes->get('_matched_route') != 'admin.graphql.api' &&
            $request->isMethod("GET")
        ) {
            // TODO: Improve Helmet to to support remove tag
            $this
                ->getContainer()
                ->get(Helmet::class)
                ->addMeta(['charset'=>'utf-8', 'data-react-helmet'=>'true'])
                ->addMeta(['name'=>'viewport', 'content'=>'width=device-width, initial-scale=1'])
                ->addMeta(['name'=>'robots', 'content'=>'INDEX,FOLLOW'])
                ->addScript(['src'=> get_js_file_url('production/axios.min.js')], 5);

            $this
                ->getContainer()
                ->get(Helmet::class)
                ->addLink(["rel"=>"apple-touch-icon", "sizes"=>"180x180", "href"=> get_admin_theme_url() . "/image/apple-touch-icon.png"])
                ->addLink(["rel"=>"icon", "type"=>"image/png", "sizes"=>"32x32", "href"=> get_admin_theme_url() . "/image/favicon-32x32.png"])
                ->addLink(["rel"=>"icon", "type"=>"image/png", "sizes"=>"16x16", "href"=> get_admin_theme_url() . "/image/favicon-16x16.png"])
                ->addLink(["rel"=>"shortcut icon", "href"=> get_admin_theme_url() . "/image/favicon.ico"]);

            if($request->isAdmin()) {
                $this
                    ->getContainer()
                    ->get(Helmet::class)
                    ->addScript(['src'=> get_js_file_url('production/tinymce/tinymce.min.js')], 1)
                    ->addScript(['src'=> get_js_file_url('production/flatpickr.js')], 1)
                    ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('flatpickr.min.css', $request->isAdmin())]);
            }
            $this
                ->getContainer()
                ->get(Helmet::class)
                ->addScript(['src'=> get_js_file_url('production/lodash.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 1)
                ->addScript(['src'=> get_js_file_url('production/react.production.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 5)
                ->addScript(['src'=> get_js_file_url('production/react-dom.production.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 5)
                ->addScript(['src'=> get_js_file_url('production/prop-types.js'), 'type'=>'text/javascript', 'defer'=> "true"], 5)
                ->addScript(['src'=> get_js_file_url('production/redux.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 5)
                ->addScript(['src'=> get_js_file_url('production/react-redux.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 5)
                ->addScript(['src'=> get_js_file_url('production/pubsub.js'), 'type'=>'text/javascript', 'defer'=> "true"], 5)
                ->addScript(['src'=> get_js_file_url('production/app.js'), 'type'=>'module', 'defer'=> "true"], 8)
                ->addScript(['src'=> get_js_file_url('production/jquery-3.3.1.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 11);
            if(!$request->isAdmin())
                $this
                    ->getContainer()
                    ->get(Helmet::class)
                    ->addScript(['src'=> get_js_file_url('production/uikit.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 9)
                    ->addScript(['src'=> get_js_file_url('production/uikit-icons.min.js'), 'type'=>'text/javascript', 'defer'=> "true"], 10)
                    ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('style.css', $request->isAdmin())])
                    ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('uikit.min.css', $request->isAdmin())]);
            else
                $this
                    ->getContainer()
                    ->get(Helmet::class)
                    ->addScript(['src'=> get_js_file_url('production/simplebar.min.js', true), 'type'=>'text/javascript'], 10)
                    ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('simplebar.css', $request->isAdmin())])
                    ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('fontawesome/css/all.min.css', $request->isAdmin())])
                    ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('style.css', $request->isAdmin())])
                    ->addLink(['rel'=>'stylesheet', 'href'=> get_css_file_url('bootstrap.css', $request->isAdmin())]);

            $response->setContent($this->renderHtml($response));
            $response->send($request->isAjax(), $response->getStatusCode());
        } else {
            if(
                $request->attributes->get('_matched_route') != 'graphql.api' &&
                $request->attributes->get('_matched_route') != 'admin.graphql.api'
            )
                $response->send($request->isAjax(), $response->getStatusCode());
            else
                $response->send($request->isAjax(), $response->getStatusCode(), true);
        }
        exit();
    }

    protected function renderHtml(Response $response)
    {
        $language = substr(Language::listLanguagesV2()[get_current_language_id()][0], 0, -3);
        $data = $response->getData();
        unset($data['isNewPage']);
        $payload = json_encode($data, 15);

        $htmlBeforeHead = $this->getContainer()->get(Helmet::class)->getHtmlBeforeCloseHead();

        ob_start();
        echo "<!DOCTYPE html><html lang='{$language}'>";
        echo "<head>";
        echo $this->getContainer()->get(Helmet::class)->render();
        echo "<script>var pageData = $payload</script>";
        foreach ($htmlBeforeHead as $html)
            echo $html;
        echo "</head>";
        echo "<body>";
        echo "<div id=\"app\"></div>";
        echo "</body></html>";
        $output = ob_get_clean();

        return $output;
    }
}