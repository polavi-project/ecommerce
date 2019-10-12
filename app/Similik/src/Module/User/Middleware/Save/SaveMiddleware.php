<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Tax\Middleware\Admin\TaxClass\Save;

use Similik\App;
use Similik\Db\Mysql;
use Similik\Http\Request; 
use Similik\Middleware\Delegate;

class SaveMiddleware extends Mysql
{
    /**
     * @param App $app
     * @param callable $next
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, callable $next, Delegate $delegate)
    {
        $this->getProcessor()->startTransaction();
        try {
            $data = $request->request->all();
            $id = $request->attributes->get('id');
            if($id)
                $this->getTable('tax_class')->where('tax_class_id', '=', $id)->update($data);
            else {
                $this->getTable('tax_class')->insert($data);
                $id = $this->getProcessor()->getLastID();
            }
            $rates = isset($data['rates']) ? $data['rates'] : [];
            array_walk($rates, function (&$value) use($id) {
               $value['tax_class_id'] = $id;
            });
            foreach ($rates as $key=>$value)
            {
                $value['country'] = (isset($value['country']) and $value['country']) ? $value['country'] : '*';
                $value['region'] = (isset($value['region']) and $value['region']) ? $value['region'] : '*';
                $value['postcode'] = (isset($value['postcode']) and $value['region']) ? $value['postcode'] : '*';
                $rate = $this->getTable('tax_rate')->load($key);
                if(is_array($rate))
                {
                    $this->getTable('tax_rate')->where($this->getTable('tax_rate')->getPrimary(), '=', $key)->update($value);
                } else {
                    $this->getTable('tax_rate')->insert($value);
                }
            }
            $this->getProcessor()->commit();
            return $next($app, true);
        } catch (\Exception $e) {
            return $next($app, $e);
        }
    }

    /**
     * @param array $data
     * @param null $id
     * @return bool|\Exception
     */
    private function save(array $data, $id = null)
    {
        // Save Attribute
        $this->getProcessor()->startTransaction();
        try {
            if((int)$id)
            {
                $oldAttribute = $this->getTable('attribute')->load((int) $id);

                if($oldAttribute == false)
                {
                    throw new \RuntimeException('Requested attribute does not exist anymore');
                } else {
                    unset($data['attribute_code']);
                    unset($data['type']);
                    $data = array_merge($oldAttribute, $data);

                    $this->getTable('attribute')->where($this->getTable('attribute')->getPrimary(), '=', (int)$id)->update($data);
                }
            } else {
                $this->getTable('attribute')->insert($data);
                $id = $this->getProcessor()->getLastID();
            }
            $options = isset($data['options']) ? $data['options'] : [];

            $this->saveOptions($id, $options);

            // Assign to Groups
            $this->getTable('attribute_group_link')->where('attribute_id', '=', $id)->delete();
            foreach ($data['groups'] as $group)
            {
                $this->getTable('attribute_group_link')->insert(['attribute_id'=>$id,'group_id'=>$group]);
            }

            $this->getProcessor()->commit();
        } catch (\Exception $e) {
            $this->getProcessor()->rollback();

            return $e;
        }

        return true;
    }

    private function saveOptions($attributeID, array $options)
    {
        $attributeData = $this->getTable('attribute')->load($attributeID);
        if($attributeData===false)
            throw new \RuntimeException("Attribute id {$attributeID} does not exist");
        if(!in_array($attributeData['type'], ['yes-no', 'select', 'multiselect']))
            return;
        $type = $attributeData['type'];
        switch ($type) {
            case 'yes-no' :
                $this->saveYesNoOptions($attributeData['product_attribute_id'], $attributeData['attribute_code']);
                break;
            case 'select' :
            case 'multiselect' :
                $this->saveSelectOptions($options, $attributeData['attribute_id'], $attributeData['attribute_code']);
                break;
        }
    }

    private function saveYesNoOptions($attributeID, $attributeCODE)
    {
        $options = $this->getTable('tax_rate')->where('attribute_id', '=', (int)$attributeID)->fetchAllAssoc();
        if(count($options)==0) {
            $insertData = [
                [
                    'attribute_id'=>$attributeID,
                    'attribute_code'=>$attributeCODE,
                    'option_text'=>'0'
                ],
                [
                    'attribute_id'=>$attributeID,
                    'attribute_code'=>$attributeCODE,
                    'option_text'=>'1'
                ]
            ];
            foreach ($insertData as $row)
            {
                $this->getTable('tax_rate')->insert($row);
            }
        }
    }

    private function saveSelectOptions(array $options, $attributeID, $attributeCODE)
    {
        if(count($options)==0)
            return;
        foreach ($options as $id=>$value)
        {
            $option = $this->getTable('tax_rate')->load($id);
            if(is_array($option))
            {
                $this->getTable('tax_rate')->where($this->getTable('tax_rate')->getPrimary(), '=', $id)->update(
                    [
                        'attribute_id'=>$attributeID,
                        'attribute_code'=>$attributeCODE,
                        'option_text'=>$value
                    ]
                );
            } else {
                $this->getTable('tax_rate')->insert(
                    [
                        'attribute_id'=>$attributeID,
                        'attribute_code'=>$attributeCODE,
                        'option_text'=>$value
                    ]
                );
            }
        }
    }
}