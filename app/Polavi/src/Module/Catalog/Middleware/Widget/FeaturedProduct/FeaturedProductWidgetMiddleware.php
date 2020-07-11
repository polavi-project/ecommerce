<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Middleware\Widget\FeaturedProduct;


use function Polavi\_mysql;
use function Polavi\array_find;
use function Polavi\generate_url;
use function Polavi\get_default_language_Id;
use function Polavi\get_js_file_url;
use Polavi\Middleware\MiddlewareAbstract;
use Polavi\Module\Graphql\Services\GraphqlExecutor;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class FeaturedProductWidgetMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->isAdmin() == true)
            return $delegate;

        $matchedRoute = $request->attributes->get('_matched_route');
        $conn = _mysql();
        $widgets = $conn->getTable('cms_widget')
            ->where('status', '=', 1)
            ->andWhere('type', '=', "featured_products")
            ->andWhere('display_setting', 'LIKE', "%{$matchedRoute}%")
            ->fetchAllAssoc();

        foreach ($widgets as $widget) {
            $setting = json_decode($widget['setting'], true);
            $products = array_find($setting, function($value, $key) {
                if($value['key'] == 'products')
                    return $value['value'] ?? null;
                return null;
            }, '');

            $displaySetting = json_decode($widget['display_setting'], true);
            $areas = array_find($displaySetting, function($value, $key) {
                if($value['key'] == 'area')
                    return json_decode($value['value'], true);
                return null;
            }, []);

            $this->getContainer()
                ->get(GraphqlExecutor::class)
                ->waitToExecute([
                    "query"=><<< QUERY
                    {
                        featuredProducts: productCollection (filters: [{key: "sku", operator: "IN" value: "{$products}"}]) {
                                products {
                                    product_id
                                    name
                                    price
                                    salePrice
                                    url
                                    image {
                                        list
                                    }
                                }
                        }
                    }
QUERY
                ])->then(function($result) use ($request, $response, $areas, $widget) {
                    /**@var \GraphQL\Executor\ExecutionResult $result */
                    //var_dump($result->data['featuredProducts']['products']);
                    if(isset($result->data['featuredProducts'])) {
                        foreach ($areas as $area)
                            $response->addWidget(
                                $widget['cms_widget_id'] . '-featured-products-widget',
                                $area,
                                (int)$widget['sort_order'],
                                get_js_file_url("production/catalog/widgets/featured_products.js", false),
                                [
                                    "title" => $widget['name'],
                                    "products" => $result->data['featuredProducts']['products'],
                                    "addItemApi" => generate_url('cart.add')
                                ]
                            );
                    }
                });

        }

        return $delegate;
    }
}