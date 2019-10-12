<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Cms\Middleware\Page\View;

use Imagine\Image\Box;
use Imagine\Image\Palette\Color\RGB;
use function Similik\get_config;
use function Similik\get_default_language_Id;
use function Similik\get_js_file_url;
use Similik\Module\Graphql\Services\GraphqlExecutor;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;
use function Similik\str_replace_last;

class ImageResizerMiddleware extends MiddlewareAbstract
{

    /**
     * @param Request $request
     * @param Response $response
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $imagine = new \Imagine\Gd\Imagine();
        $width = 200;
        $height = 500;

        $path = MEDIA_PATH . DS . "abc/1550688238-theory-1550688225.jpg";

        $image = $imagine->open($path);
        $imageW = $image->getSize()->getWidth();
        $imageH = $image->getSize()->getHeight();
        if($imageW <= $width && $imageH <= $height) {
            $image->save(str_replace_last('.', '_list.', $path));
        } else {
            $wRatio = $imageW / $width;
            $hRatio = $imageH / $height;
            if($wRatio > $hRatio) {
                $height = $imageH / $wRatio;
            } else {
                $width = $imageW / $hRatio;
            }
            $size = new Box($width, $height);
            $image->resize($size)->save(str_replace_last('.', '_list.', $path));
        }
        //$image->thumbnail($size)->save(str_replace_last('.', '_list.', $path));

        return $response;
    }
}