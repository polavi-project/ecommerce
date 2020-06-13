<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Save;

use Similik\Module\Catalog\Services\ProductMutator;
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
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $data = $request->request->all();
        try {
            if($request->get('id', null) != null)
                return null;
            $id = $this->getContainer()->get(ProductMutator::class)->createProduct($data);
            $this->getContainer()->get(Session::class)->getFlashBag()->add('success', 'Product has been saved');
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('product.grid'));

            return $id;
        } catch(\Exception $e) {
            $response->addAlert('product_add_error', 'error', $e->getMessage())->notNewPage();
            return $response;
        }
    }
}