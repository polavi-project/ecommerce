<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Widget\FeaturedProduct;


use function Similik\get_js_file_url;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;

class RegisterTypeMiddleware extends MiddlewareAbstract
{

    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $response->addWidget(
            'featured_product_widget_type_option',
            'widget_types',
            20,
            get_js_file_url("production/catalog/widgets/featured_product/type.js", true)
        );

        return $delegate;
    }
}