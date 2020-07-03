# Polavi
A powerful and simple eCommerce platform using ReactJs, Graphql, PHP and Mysql.
## Features
![Polavi backend screenshot](/polavi-project/ecommerce/blob/master/public/theme/admin/default/image/screenshot.jpg)
* Catalog management
  * Category
  * Product
      * Product type and attributes
      * Advance pricing
        * Customer group price
        * Tier price
      * Product custom options - Add custom option to product with extra price
      * Product variants
* Coupon management
    * Multi type of discount
        * Fixed discount to entire order
        * Percentage discount to entire order
        * Fixed discount to specific products
        * Percentage discount to specific products
        * Buy X get Y
        * Free shipping
    * Complex order and customer condition
* Order management
* Customer management
## Demo
[Demo store](https://demo.polavi.com/admin)
* Email: demo@polavi.com
* Password: demo

## Getting Started
### Installation

Please check [here](https://polavi.com/docs/installation-guide) for more detail.

### Middleware system
```php
declare(strict_types=1);

namespace Polavi\Middleware;

use function Polavi\generate_url;
use Polavi\Services\Http\Request;
use Polavi\Services\Http\Response;
use Polavi\Services\Routing\Router;

class RoutingMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $code = $this->getContainer()->get(Router::class)->dispatch();
        if($code == 404)
            $response->setStatusCode(404);
        else if($code == 405)
            $response->setContent('Method Not Allowed')->setStatusCode(405);
        else {
            $response->addState("currentRoute", $request->attributes->get("_matched_route"));
            $response->addState("currentRouteArgs", $request->attributes->get("_route_args"));
            $response->addState("currentUrl", generate_url($request->attributes->get("_matched_route"), $request->attributes->get("_route_args")));
        }

        return $delegate;
    }
}
```

### Client rendering approach with es6 module dynamic import.
```php
$response->addWidget(
    'category_edit_general',
    'admin_category_edit_inner_left',
    10,
    get_js_file_url("production/catalog/category/edit/general.js", true),
    [
        "id"=>"category_edit_general", 
        "data" => $result->data['generalInfo']
    ]
);
```

### ReactJs template with Area and Widget
```php
$response->addWidget(
    'admin_content',
    'container',
    20,
    get_js_file_url("production/area.js", true),
    [
        "id"=> "content_wrapper",
        "className"=> "content-wrapper"
    ]
);

// Adding a widget to Area
$response->addWidget(
    'admin_footer',
    'content_wrapper',
    20,
    get_js_file_url("production/cms/footer.js", true)
);
```

### Loading data with Graphql and Promise
```php
$this->getContainer()
    ->get(GraphqlExecutor::class)
    ->waitToExecute([
        "query"=>"{generalInfo: category(id: {$request->get('id')} language:{$request->get('language', get_default_language_Id())}){name status description include_in_nav position}}"
    ])
    ->then(function($result) use ($response) {
        /**@var \GraphQL\Executor\ExecutionResult $result */
        if(isset($result->data['generalInfo'])) {
            $response->addWidget(
            'category_edit_general',
            'admin_category_edit_inner_left',
            10,
            get_js_file_url("production/catalog/category/edit/general.js", true),
            [
                "id"=>"category_edit_general", 
                "data" => $result->data['generalInfo']]
            );
        }
    });
```

### Prerequisites

Apache server, PHP 7.3, Mysql 5.6 and 1 free SendGrid account for transactional email
Please check [here](https://polavi.com/docs/system-prerequisites) for more detail.

## Built With

* [Symfony](https://github.com/symfony/symfony/) - Some component from Symfony like HttpFoundation, EventDispatcher
* [React](https://github.com/facebook/react/) - All of html will be rendered by using ReactJs
* [Graphql-php](https://github.com/webonyx/graphql-php/) - A great php framework for graphql
* [Promises](https://github.com/guzzle/promises) - Promises/A+ library for PHP

## Contributing
Contributions are welcome and appreciated. I am looking for any feedback or suggestion to improve this project. You can:
* Submit a bug/issue or suggestion
* Use [this feedback page](https://polavi.com/feedback) if you have any idea or feedback about this project
* Submit a PR

## Support / Discussion
If you are facing any problem or just want to discuss about this project, I invite you to join my [Discord channel here](https://discordapp.com/invite/Spcudm7) 