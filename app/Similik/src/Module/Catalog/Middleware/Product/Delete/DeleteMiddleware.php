<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Delete;


use function Similik\_mysql;
use function Similik\generate_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class DeleteMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        try {
            $conn = _mysql();
            $product = $conn->getTable('product')->load($request->attributes->get('id'));
            if($product == false)
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