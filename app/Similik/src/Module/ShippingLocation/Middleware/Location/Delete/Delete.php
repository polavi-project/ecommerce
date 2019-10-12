<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Handler\Admin\Attribute;

use Similik\App;
use Similik\Http\Response;
use Similik\Services\Catalog\Product\Product;
use Similik\Http\Request;
use Similik\Middleware\Delegate;

class View
{
    public function __invoke(App $app)
    {
        $id = (int) $request->attributes->get('id');
        $product_model = new Product();
        $product = $product_model->loadProduct($id);
        if($product == false) {
            $response->setStatusCode(404);
            return false;
        } else {
            // What is next?
            $app['current_product'] = $product;
            $response->setContent('This is fucking product page');

            return $app['current_product'];
        }
    }
}