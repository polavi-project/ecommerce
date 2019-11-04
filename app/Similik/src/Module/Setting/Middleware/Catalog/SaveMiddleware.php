<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\Catalog;

use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;
use Similik\Services\Routing\Router;
use Symfony\Component\HttpFoundation\Session\Session;

class SaveMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        if($request->getMethod() == 'GET')
            return $delegate;
        $processor = _mysql();
        $processor->startTransaction();
        $language = $request->attributes->get('language', get_default_language_Id());
        $language = $language == get_default_language_Id() ? 0 : $language;
        //$availableLanguages = get_config('catalog_languages', []);
        try {
            $data = $request->request->all();
            foreach ($data as $name=> $value) {
                if(is_array($value))
                    $processor->getTable('setting')
                        ->insertOnUpdate([
                            'name'=>$name,
                            'value'=>json_encode($value, JSON_NUMERIC_CHECK),
                            'json'=>1,
                            'language_id'=>$language
                        ]);
                else
                    $processor->getTable('setting')
                        ->insertOnUpdate([
                            'name'=>$name,
                            'value'=>$value,
                            'json'=>0,
                            'language_id'=>$language
                        ]);
            }

            // Language update
//            $languages = $data['catalog_languages'];
//            $newLanguages = array_diff($languages, $availableLanguages);
//            if($newLanguages) {
//                $this->copyProductDescription($newLanguages, $processor);
//                $this->copyCategoryDescription($newLanguages, $processor);
//                $this->copyAttributeTextValue($newLanguages, $processor);
//            }
            $processor->commit();
            $this->getContainer()->get(Session::class)->getFlashBag()->add('success', 'Setting saved');
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('setting.catalog'));
        } catch (\Exception $e) {
            $processor->rollback();
            $response->addAlert('catalog_setting_update_error', 'error', $e->getMessage());
        }

        return $response;
    }
}