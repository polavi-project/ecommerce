<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Category\Edit;

use function Polavi\generate_url;
use function Polavi\get_config;
use function Polavi\get_default_language_Id;
use function Polavi\get_display_languages;
use function Polavi\get_js_file_url;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;

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
                "currentLanguage" => $request->query->get('language') != null ? $request->query->get('language') : get_default_language_Id(),
                "listUrl" => generate_url('category.grid'),
                "cancelUrl" => $request->attributes->get('id') ? generate_url('category.edit', ['id' => $request->attributes->get('id')]) : generate_url('category.create')
            ]
        );

        return $delegate;
    }
}
