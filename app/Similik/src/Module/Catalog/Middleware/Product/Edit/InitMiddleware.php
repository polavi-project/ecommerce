<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Edit;

use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Services\Helmet;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;
use Similik\Middleware\MiddlewareAbstract;

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