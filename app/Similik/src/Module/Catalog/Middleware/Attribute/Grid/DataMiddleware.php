<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Grid;

use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class DataMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param callable $next
     * @param Delegate|null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $setting = [
            'sort_by'    => $request->get('sort_by'),
            'sort_order' => $request->get('sort_order'),
            'page'       => $request->get('page'),
            'limit'      => $request->get('limit') ? $request->get('limit') : 20
        ];
        $mysql_collection = $delegate->get('mysql_collection');
        $attributes = $mysql_collection
            ->fetchAssoc($setting);
        foreach ($attributes as &$attribute) {
            if(isset($attribute['type'])) {
                $attribute['type'] = ucfirst($attribute['type']);
            }
            if(isset($attribute['is_required'])) {
                $attribute['is_required'] = 0 ? 'No': 'Yes';
            }
            if(isset($attribute['display_on_frontend'])) {
                $attribute['display_on_frontend'] = 0 ? 'No': 'Yes';
            }
            $attribute['action'] = [
                [
                    'text'=>'Edit',
                    'url'=>build_url('attribute/edit/' . $attribute['attribute_id'])
                ]
            ];
        }
        $delegate->offsetSet('attributes', $attributes);
        return $next($request, $response, $delegate);
    }
}