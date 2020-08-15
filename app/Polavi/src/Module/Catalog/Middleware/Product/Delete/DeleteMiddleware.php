<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Product\Delete;


use function Polavi\_mysql;
use function Polavi\generate_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;

class DeleteMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $conn = _mysql();
            $product = $conn->getTable('product')->load($request->attributes->get('id'));
            if ($product == false)
                throw new \Exception("Requested product does not exist");
            $conn->getTable('product')->where('product_id', '=', $request->attributes->get('id'))->delete();
            $response->addAlert("product_delete_success", "success", "Product deleted");
            $response->redirect(generate_url('product.grid'));

            return $product;
        } catch (\Exception $e) {
            $response->addAlert("product_delete_error", "error", $e->getMessage())->notNewPage();

            return false;
        }
    }
}