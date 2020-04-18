<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Setting\Middleware\General;

use function Similik\_mysql;
use function Similik\get_default_language_Id;
use Similik\Services\Db\Processor;
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
        //$availableLanguages = get_config('general_languages', []);
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
//            $languages = $data['general_languages'];
//            $newLanguages = array_diff($languages, $availableLanguages);
//            if($newLanguages) {
//                $this->copyProductDescription($newLanguages, $processor);
//                $this->copyCategoryDescription($newLanguages, $processor);
//                $this->copyAttributeTextValue($newLanguages, $processor);
//            }
            $processor->commit();
            $response->addAlert('general_setting_update_success', 'success', "Setting saved successfully");
            $response->redirect($this->getContainer()->get(Router::class)->generateUrl('setting.general'));
        } catch (\Exception $e) {
            $processor->rollback();
            $response->addAlert('general_setting_update_error', 'error', $e->getMessage());
        }

        return $response;
    }

    protected function copyProductDescription(array $newLanguages, Processor $processor)
    {
        $cols = $processor->getTable('product_description')->getColumns();
        $columns = [];
        foreach ($cols as $col) {
            $columns[] = $col['Field'];
        }
        $columns = '(' . implode(",", $columns) . ')';
        $products = $processor->getTable('product_description')
            ->where('language_id', '=', 0)->fetchAllAssoc();
        if(!$products)
            return;
        $questionMarks = '';
        foreach ($products as $product) {
            $temp = '(';
            $i=0;
            while ($i< count($product) -1) {
                $temp .= '?, ';
                $i ++;
            }
            $temp = trim($temp, ', ');
            $temp .= '), ';
            $questionMarks .= $temp;
        }
        $questionMarks = trim($questionMarks, ', ');
        foreach ($newLanguages as $newLanguage) {
            $values = [];
            foreach ($products as $product) {
                unset($product['product_description_id']);
                $product['language_id'] = $newLanguage;
                $values = array_merge($values, array_values($product));
            }
            $query = "INSERT IGNORE INTO `product_description` {$columns} VALUES{$questionMarks}";
            $stmt = $processor->prepare($query);
            $stmt->execute($values);
        }
    }

    protected function copyCategoryDescription(array $newLanguages, Processor $processor)
    {
        $cols = $processor->getTable('category_description')->getColumns();
        $columns = [];
        foreach ($cols as $col) {
            $columns[] = $col['Field'];
        }
        $columns = '(' . implode(",", $columns) . ')';
        $categories = $processor->getTable('category_description')
            ->where('language_id', '=', 0)
            ->fetchAllAssoc();
        if(!$categories)
            return;
        $questionMarks = '';
        foreach ($categories as $category) {
            $temp = '(';
            $i=0;
            while ($i< count($category) -1) {
                $temp .= '?, ';
                $i ++;
            }
            $temp = trim($temp, ', ');
            $temp .= '), ';
            $questionMarks .= $temp;
        }
        $questionMarks = trim($questionMarks, ', ');
        foreach ($newLanguages as $newLanguage) {
            $values = [];
            foreach ($categories as $category) {
                unset($category['category_description_id']);
                $category['language_id'] = $newLanguage;
                $values = array_merge($values, array_values($category));
            }
            $query = "INSERT IGNORE INTO `category_description` {$columns} VALUES{$questionMarks}";
            $stmt = $processor->prepare($query);
            $stmt->execute($values);
        }
    }

    protected function copyAttributeTextValue(array $newLanguages, Processor $processor)
    {
        $cols = $processor->getTable('product_attribute_value_index')->getColumns();
        $columns = [];
        foreach ($cols as $col) {
            $columns[] = $col['Field'];
        }
        $columns = '(' . implode(",", $columns) . ')';
        $attributes = $processor->getTable('product_attribute_value_index')
            ->where('language_id', '=', 0)
            ->fetchAllAssoc();
        if(!$attributes)
            return;
        $questionMarks = '';
        foreach ($attributes as $attribute) {
            $temp = '(';
            $i=0;
            while ($i< count($attribute) -1) {
                $temp .= '?, ';
                $i ++;
            }
            $temp = trim($temp, ', ');
            $temp .= '), ';
            $questionMarks .= $temp;
        }
        $questionMarks = trim($questionMarks, ', ');
        foreach ($newLanguages as $newLanguage) {
            $values = [];
            foreach ($attributes as $attribute) {
                unset($attribute['product_attribute_value_index_id']);
                $attribute['language_id'] = $newLanguage;
                $values = array_merge($values, array_values($attribute));
            }
            $query = "INSERT IGNORE INTO `product_attribute_value_index` {$columns} VALUES{$questionMarks}";
            $stmt = $processor->prepare($query);
            $stmt->execute($values);
        }
    }
}