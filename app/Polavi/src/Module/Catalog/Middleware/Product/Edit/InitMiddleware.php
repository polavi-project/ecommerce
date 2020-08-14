<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\Edit;

use function Polavi\_mysql;
use Polavi\Services\Helmet;
use Polavi\Services\Http\Response;
use Polavi\Services\Http\Request;
use Polavi\Middleware\MiddlewareAbstract;

class InitMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     * @internal param callable $next
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $id = (int) $request->attributes->get('id');
        if($id) {
            $product = _mysql()->getTable('product')->load($id);
            if($product === false) {
                $response->addData('success', 0);
                $response->addData('message', 'Requested product does not exist');

                return $response;
            }
            $this->getContainer()->get(Helmet::class)->setTitle('Edit product');
        }
        $this->getContainer()->get(Helmet::class)->setTitle('Create new product');

        return $delegate;
    }
}