<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\View;

use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Services\Helmet;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;


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
                    ->andWhere('status', '=', 1)
                    ->fetchOneAssoc();
        } else
            $product = $conn->getTable('product')
                ->where('product_id', '=', $request->attributes->get('id'))
                ->andWhere('status', '=', 1)
                ->fetchOneAssoc();

        if(!$product) {
            $response->setStatusCode(404);
            $request->attributes->set('_matched_route', 'not.found');
            return $delegate;
        }

        $request->attributes->set('id', $product['product_id']);
        $des = $conn->getTable('product_description')
            ->where('product_description_product_id', '=', $product['product_id'])
            ->andWhere('language_id', '=', get_default_language_Id())
            ->fetchOneAssoc();

        $this->getContainer()->get(Helmet::class)->setTitle($des['name'])->addMeta([
            'name'=> 'description',
            'content' => $des['short_description']
        ]);

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