<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\Edit;

use function Similik\get_config;
use function Similik\get_default_language_Id;
use function Similik\get_display_languages;
use function Similik\get_js_file_url;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;

class FormMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'category-edit-form',
            'content',
            10,
            get_js_file_url("production/catalog/category/edit/category_edit_form.js", true),
            [
                "id"=> 'category-edit-form',
                "action" => $this->getContainer()->get(Router::class)->generateUrl("category.save", ['id'=>$request->attributes->get('id', null)], $request->query->get('language', null) != null ? ['language' => $request->query->get('language')] : null),
                "defaultLanguage" => get_default_language_Id(),
                "currentLanguage" => $request->query->get('language') != null ? $request->query->get('language') : get_default_language_Id()
            ]
        );

        return $delegate;
    }
}
