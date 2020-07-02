<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\View;

use function Polavi\_mysql;
use function Polavi\get_default_language_Id;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Middleware\MiddlewareAbstract;


class InitMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $conn = _mysql();
        $product = null;
        if($request->attributes->get('slug')) {
            $des = $conn->getTable('product_description')
                ->where('seo_key', '=', $request->attributes->get('slug'))
                ->andWhere('language_id', '=', get_default_language_Id())
                ->fetchOneAssoc();
            if($des)
                $product = $conn->getTable('product')
                    ->where('product_id', '=', $des['product_description_product_id'])
                    ->fetchOneAssoc();
        } else
            $product = $conn->getTable('product')
                ->where('product_id', '=', $request->attributes->get('id'))
                ->fetchOneAssoc();

        if(!$product) {
            $response->setStatusCode(404);
            $request->attributes->set('_matched_route', 'not.found');
            return $delegate;
        }

        $request->attributes->set('id', $product['product_id']);

        $response->addState('product', [
            'id' => $product['product_id'],
            'regularPrice' => $product['price'],
            'sku' => $product['sku'],
            'weight' => $product['weight'],
            'isInStock' => $product['manage_stock'] == 0 || ($product['qty'] > 0 && $product['stock_availability'] == 1)
        ]);

        return $product;
    }
}