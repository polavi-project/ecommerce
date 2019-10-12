<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Attribute\Save;

use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Middleware\Delegate;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Symfony\Component\HttpFoundation\Session\Session;

class CreateMiddleware extends MiddlewareAbstract
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
        if(get_request_attribute('id') != null)
            return $next($request, $response, $delegate);
        $processor = new Processor();
        try {
            $processor->startTransaction();
            $data = $delegate->get('category_data');
            get_mysql_table('category', $processor)->insert($data);
            $languages = get_config('general_languages', [26]);
            array_unshift($languages, get_default_language_id());
            $category_id = (int) $processor->getLastID();
            $data['category_description_category_id'] = $category_id;
            foreach ($languages as $language) {
                $data['language_id'] = $language;
                get_mysql_table('category_description', $processor)->insert($data);
            }
            $processor->commit();
            the_app()->get(Session::class)->getFlashBag()->add('success', __('Category has been saved'));
            $response->addData('success', 1);
            $response->addData('redirect_url', build_url('categories'));
            $delegate->stopAndResponse();
            return $next($request, $response, $delegate);
        } catch(\Exception $e) {
            $processor->rollback();
            $response->addData('success', 0);
            $response->addData('message', $e->getMessage());
            $delegate->stopAndResponse();
            return $next($request, $response, $delegate);
        }
    }

}