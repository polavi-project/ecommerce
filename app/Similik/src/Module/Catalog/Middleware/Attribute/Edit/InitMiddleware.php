<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Edit;

use Similik\Services\Db\Processor;
use Similik\Services\Http\Response;
use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Middleware\MiddlewareAbstract;

class InitMiddleware extends MiddlewareAbstract
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
        $id = (int) $request->attributes->get('id');
        $language_id = (int) $request->request->get('language_id', get_default_language_id());
        if($id) {
            $processor = new Processor();
            $cat_data = get_mysql_table('category', $processor)->load($id);
            if($cat_data === false) {
                $response->addData('success', 0);
                $response->addData('message', 'Requested category does not exist');
                $delegate->stopAndResponse();
            } else {
                $description = get_mysql_table('category_description', $processor)
                    ->where('language_id', '=', $language_id)
                    ->andWhere('category_description_category_id', '=', $id)
                    ->fetchOneAssoc();
                if(!$description)
                    $description = get_mysql_table('category_description', $processor)
                        ->where('language_id', '=', 0)
                        ->andWhere('category_description_category_id', '=', $id)
                        ->fetchOneAssoc();
                $cat_data = array_merge($cat_data, $description);
                $delegate->set('category', $cat_data);
            }
        }
        return $next($request, $response, $delegate);
    }
}