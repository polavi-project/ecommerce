<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Category\Save;

use Polavi\Module\Catalog\Services\CategoryMutator;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;

class CreateMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param array $data
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $data = [])
    {
        try {
            if($request->get('id', null) != null)
                return $data;
            $this->getContainer()->get(CategoryMutator::class)->createCategory($data);
            $this->getContainer()->get(Session::class)->getFlashBag()->add('success', 'Category has been saved');
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('category.grid'));

            return $response;
        } catch(\Exception $e) {
            $response->addAlert('category_add_error', 'error', $e->getMessage());

            return $response;
        }
    }
}