<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Category\View;

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
        if($request->attributes->get('slug'))
            $category = _mysql()->getTable('category')
            ->leftJoin('category_description', null, [
                [
                    'column'      => "category_description.language_id",
                    'operator'    => "=",
                    'value'       => $request->get('language', get_default_language_Id()),
                    'ao'          => 'and',
                    'start_group' => null,
                    'end_group'   => null
                ]
            ])
            ->where('category_description.seo_key', '=', $request->attributes->get('slug'))
            ->fetchOneAssoc();
        else
            $category = _mysql()->getTable('category')
                ->leftJoin('category_description', null, [
                    [
                        'column'      => "category_description.language_id",
                        'operator'    => "=",
                        'value'       => $request->get('language', get_default_language_Id()),
                        'ao'          => 'and',
                        'start_group' => null,
                        'end_group'   => null
                    ]
                ])
                ->where('category.category_id', '=', $request->attributes->get('id'))
                ->fetchOneAssoc();

        if(!$category) {
            $request->attributes->set('_matched_route', 'not.found');
            $response->setStatusCode(404);
        } else
            $request->attributes->set('id', $category['category_id']);

        $this->getContainer()->get(Helmet::class)->setTitle($category['name'])
            ->addMeta([
               'name'=> 'description',
                'content' => $category['short_description']
            ]);

        $response->addState('currentPage', 'Category')->addState('categoryId', $category['category_id']);
        return $delegate;
    }
}