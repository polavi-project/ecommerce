<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Discount\Middleware\Save;

use Polavi\Http\Request;
use Polavi\Middleware\Delegate;
use Polavi\Http\Response;
use Polavi\Module\Discount\Middleware\Edit\FormMiddlewareold;
use Symfony\Component\HttpFoundation\RedirectResponse;

class ValidateMiddlewareold extends FormMiddlewareold
{
    public function __construct()
    {
        $data = the_app()->get(Request::class)->request->all();
        parent::__construct($data);
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $data = $request->request->all();
        if ($this->validate() == true) {
            return $next($request, $response, $delegate);
        } else {
            if ($id = get_request_attribute('id'))
                $url = build_url('promotion/edit/' . $id, $data);
            else
                $url = build_url('promotion/create', $data);

            return $next($request, $response, new RedirectResponse($url));
        }
    }
}