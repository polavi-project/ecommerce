<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Catalog\Services;


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
            $this->processor->getTable('category')->insert($data);
            $categoryId = (int) $this->processor->getLastID();
            $data['category_description_category_id'] = $categoryId;
            $this->processor->getTable('category_description')->insert($data);

            $this->processor->commit();
        } catch (\Exception $e) {
            $this->processor->rollback();
            throw $e;
        }
    }

    public function updateCategory(int $id, array $data)
    {
        $category = $this->processor->getTable('category')->load($id);
        if($category == false)
            throw new \RuntimeException('Requested category does not exist');
        $this->processor->startTransaction();
        try {
            $this->processor->getTable('category')->where('category_id', '=', $id)->update($data);
            $data['category_description_category_id'] = $id;
            $this->processor->getTable('category_description')
                ->insertOnUpdate($data);

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