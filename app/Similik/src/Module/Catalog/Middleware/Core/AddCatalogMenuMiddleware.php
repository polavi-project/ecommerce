<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Core;


use Similik\Middleware\MiddlewareAbstract;
use Similik\Module\Cms\Services\NavigationManager;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Services\Routing\Router;

class AddCatalogMenuMiddleware extends MiddlewareAbstract
{
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if(!$request->isAdmin())
            return $delegate;
        $this->getContainer()->get(NavigationManager::class)
            ->addItem(
                'catalog',
                'Catalog',
                '',
                'database'
            )
            ->addItem(
                'products',
                'All product',
                $this->getContainer()->get(Router::class)->generateUrl('product.grid'),
                'list',
                'catalog'
            )
            ->addItem(
                'new-product',
                'Add product',
                $this->getContainer()->get(Router::class)->generateUrl('product.create'),
                'plus',
                'catalog'
            )
            ->addItem(
                'categories',
                'All category',
                $this->getContainer()->get(Router::class)->generateUrl('category.grid'),
                'list',
                'catalog'
            )
            ->addItem(
                'new-category',
                'Add category',
                $this->getContainer()->get(Router::class)->generateUrl('category.create'),
                'plus',
                'catalog'
            );


        return true;
    }
}