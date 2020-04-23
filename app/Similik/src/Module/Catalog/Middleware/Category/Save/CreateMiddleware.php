<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\Save;

use Similik\Module\Catalog\Services\CategoryMutator;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;
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