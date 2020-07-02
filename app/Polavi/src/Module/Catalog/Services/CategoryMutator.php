<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services;


use function Polavi\get_config;
use function Polavi\get_default_language_Id;
use Polavi\Services\Db\Processor;

class CategoryMutator
{
    /**@var Processor $this->processor*/
    private $processor;

    public function __construct(Processor $processor)
    {
        $this->processor = $processor;
    }

    public function createCategory(array $data)
    {
        $this->processor->startTransaction();
        try {
            $languages = get_config('general_languages', [26]);
            array_push($languages, 0);
            $this->processor->getTable('category')->insert($data);
            $categoryId = (int) $this->processor->getLastID();
            $data['category_description_category_id'] = $categoryId;
            foreach ($languages as $language) {
                $data['language_id'] = $language;
                $this->processor->getTable('category_description')->insert($data);
            }

            $this->processor->commit();
        } catch (\Exception $e) {
            $this->processor->rollback();
            throw $e;
        }
    }

    public function updateCategory(int $id, int $languageId, array $data)
    {
        $category = $this->processor->getTable('category')->load($id);
        if($category == false)
            throw new \RuntimeException('Requested category does not exist');
        $this->processor->startTransaction();
        try {
            $this->processor->getTable('category')->where('category_id', '=', $id)->update($data);
            $data['category_description_category_id'] = $id;
            $data['language_id'] = $languageId;
            $this->processor->getTable('category_description')
                ->insertOnUpdate($data);

            if($languageId == get_default_language_Id()) {
                $data['language_id'] = 0;
                $this->processor->getTable('category_description')
                    ->insertOnUpdate($data);
            }

            $this->processor->commit();
        } catch (\Exception $e) {
            $this->processor->rollback();
            throw $e;
        }
    }

    public function deleteCategory(int $id)
    {

    }
}