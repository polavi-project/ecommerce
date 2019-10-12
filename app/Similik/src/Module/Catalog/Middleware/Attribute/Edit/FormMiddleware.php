<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Edit;

use Similik\Services\Helper;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class FormMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @param Delegate|null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $response->addWidget(
            'attribute_edit_form',
            'content',
            10,
            Helper::getJsFileUrl("production/form.js"),
            [
                "id"=>"attribute_edit_form",
                "action"=> get_request_attribute('id', null) != null ? build_url("attribute/save/" . get_request_attribute('id', null)) : build_url("attribute/save")
            ]
        );
        return $next($request, $response, $delegate);
    }
}
